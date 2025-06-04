import type { NextApiRequest, NextApiResponse } from 'next';
import levelsConfig, { LevelConstant } from '../../../../game/constants/serverLevels';

interface ResponseLevelData {
  order: number;
  name: string;
  backgroundUrl?: string;
  requiredScore: number;
  // Add other properties you might want to return about the level
}

interface ApiResponse {
  unlocked?: boolean;
  level?: ResponseLevelData;
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { completedLevelId } = req.query;
  const { score } = req.body;

  if (typeof completedLevelId !== 'string' || !completedLevelId) {
    return res.status(400).json({ message: 'Invalid or missing completedLevelId.' });
  }

  const parsedCompletedLevelId = parseInt(completedLevelId, 10);
  if (isNaN(parsedCompletedLevelId)) {
    return res.status(400).json({ message: 'completedLevelId must be a number.' });
  }

  if (typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid or missing score in request body.' });
  }

  const completedLevel = levelsConfig.find((l: LevelConstant) => l.order === parsedCompletedLevelId);

  if (!completedLevel) {
    return res.status(404).json({ message: `Level with ID ${parsedCompletedLevelId} not found.` });
  }

  const nextLevelOrder = parsedCompletedLevelId + 1;
  const nextLevel = levelsConfig.find((l: LevelConstant) => l.order === nextLevelOrder);

  if (!nextLevel) {
    return res.status(200).json({
      unlocked: false, // Or true, depending on how you define 'completing all levels'
      message: "Congratulations! You've completed all available challenge levels!"
    });
  }

  if (score >= nextLevel.requiredScore) {
    const nextLevelData: ResponseLevelData = {
      order: nextLevel.order,
      name: nextLevel.name,
      backgroundUrl: nextLevel.backgroundUrl,
      requiredScore: nextLevel.requiredScore,
    };
    return res.status(200).json({
      unlocked: true,
      level: nextLevelData,
      message: `You've met the score requirement for ${nextLevel.name}!`
    });
  } else {
    return res.status(200).json({
      unlocked: false,
      message: `You scored ${score}. You need ${nextLevel.requiredScore} points to feel ready for ${nextLevel.name}. Keep practicing!`
    });
  }
} 
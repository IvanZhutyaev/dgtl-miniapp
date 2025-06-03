import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Проверяем аутентификацию
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Проверяем наличие SERVER_URL
    const serverUrl = process.env.SERVER_URL;
    if (!serverUrl) {
      console.error('SERVER_URL is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Получаем данные об уровнях
    const response = await axios.get(`${serverUrl}/api/levels`);
    
    // Если нет данных, возвращаем пустой массив
    if (!response.data) {
      return res.status(200).json([]);
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching levels:', error);
    // Более детальная информация об ошибке
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      message: 'Failed to fetch levels',
      error: errorMessage
    });
  }
}

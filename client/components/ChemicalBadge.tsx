import React from 'react';
import styles from '../styles/ChemicalBadge.module.css';

interface ChemicalBadgeProps {
  element: string;
}

const ChemicalBadge: React.FC<ChemicalBadgeProps> = ({ element }) => {
  return (
    <div className={styles.chemicalBadge}>
      {element}
    </div>
  );
};

export default ChemicalBadge; 
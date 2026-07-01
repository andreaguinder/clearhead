'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareBoardModal from '../ShareBoardModal/ShareBoardModal';
import styles from './ShareBoardButton.module.scss';

interface ShareBoardButtonProps {
  boardId: string;
}

export default function ShareBoardButton({ boardId }: ShareBoardButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className={styles.shareButton}
        onClick={() => setIsModalOpen(true)}
      >
        <Share2 size={24} style={{ color: 'white'}}/> 
      </button>

      {/* El modal se renderiza acá de manera autónoma cuando el botón lo decide */}
      {isModalOpen && (
        <ShareBoardModal 
          boardId={boardId} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}
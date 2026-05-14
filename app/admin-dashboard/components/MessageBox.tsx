import React from 'react';
import styles from './MessageBox.module.css';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface MessageBoxProps {
  type: 'success' | 'error' | 'confirm';
  message: string;
  onClose: () => void;      // Called for "OK", "Cancel", or "X"
  onConfirm?: () => void;   // Only used when type is 'confirm'
}

const MessageBox: React.FC<MessageBoxProps> = ({ type, message, onClose, onConfirm }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Icon Section */}
        <div className={styles.iconWrapper}>
          {type === 'success' && <CheckCircle className={styles.successIcon} size={60} />}
          {type === 'error' && <XCircle className={styles.errorIcon} size={60} />}
          {type === 'confirm' && <HelpCircle className={styles.confirmIcon} size={60} />}
        </div>

        {/* Text Section */}
        <h3 className={styles.title}>
          {type === 'success' ? 'Success!' : type === 'error' ? 'Oops!' : 'Are you sure?'}
        </h3>
        <p className={styles.message}>{message}</p>

        {/* Buttons Section */}
        <div className={styles.buttonGroup}>
          {type === 'confirm' ? (
            <>
              <button 
                className={`${styles.btn} ${styles.confirmBtn}`} 
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
              >
                Yes, Delete
              </button>
              <button 
                className={`${styles.btn} ${styles.cancelBtn}`} 
                onClick={onClose}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className={`${styles.btn} ${styles.closeBtn}`} onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
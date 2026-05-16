import React from 'react';
import styles from './MessageBox.module.css';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface MessageBoxProps {
  type: 'success' | 'error' | 'confirm';
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string; // custom label for the confirm button, defaults to "Yes, Delete"
}

const MessageBox: React.FC<MessageBoxProps> = ({
  type,
  message,
  onClose,
  onConfirm,
  confirmLabel,
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Icon */}
        <div className={styles.iconWrapper}>
          {type === 'success' && <CheckCircle className={styles.successIcon} size={60} />}
          {type === 'error'   && <XCircle    className={styles.errorIcon}   size={60} />}
          {type === 'confirm' && <HelpCircle className={styles.confirmIcon} size={60} />}
        </div>

        {/* Text */}
        <h3 className={styles.title}>
          {type === 'success' ? 'Success!' : type === 'error' ? 'Oops!' : 'Are you sure?'}
        </h3>
        <p className={styles.message}>{message}</p>

        {/* Buttons */}
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
                {confirmLabel || 'Yes, Delete'}
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
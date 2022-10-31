import styles from './modal.module.css';

const ModalWarning = ({ state, changeState, deleteSA }) => {
  return (
    <>
      {state && (
        <div className={styles.overlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h3>Titulo</h3>
            </div>
            <button
              onClick={() => {
                changeState(false);
              }}
              className={styles.btnClose}
            >
              <img src={`${process.env.PUBLIC_URL}/assets/images/icon-close.svg`} />
            </button>
            <div className={styles.modalBody}>
              <h3>Do you really want to delete super admin</h3>
              <p>This process cannot be undone</p>
              <button
                onClick={() => {
                  deleteSA();
                }}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalWarning;

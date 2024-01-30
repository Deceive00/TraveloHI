import styles from './loading.module.scss'
export default function Loading(){
  return(
    <div className={styles.loadingContainer}>
      <div className={styles.loadingAnimation}></div>
    </div>
  );
}
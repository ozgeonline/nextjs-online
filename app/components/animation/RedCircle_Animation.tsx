import styles from "./animation.module.css"

export default function RedCircle_Animation() {
  return (
    <div className={`
      ${styles.animate}
       absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        size-[50px] border-4 border-b-0 border-y-main-red border-l-main-red border-transparent mb-32 rounded-full
      `}></div>
  )
}
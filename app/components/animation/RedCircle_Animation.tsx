import styles from "./animation.module.css"

type RedCircleAnimationProps = {
  className?: string;
};

export default function RedCircle_Animation({ className }: RedCircleAnimationProps) {
  return (
    <div
      className={`
        pointer-events-none absolute inset-0 z-[100] flex items-center justify-center
        ${className ?? ""}
      `}
      aria-hidden="true"
    >
      <div
        className={`
          ${styles.animate}
          size-[50px] border-4 border-b-0 border-y-main-red border-l-main-red border-transparent rounded-full
        `}
      />
    </div>
  )
}

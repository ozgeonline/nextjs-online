import styles from "./animation.module.css"
export default function BoxLoading_Animation() {
  return (
    <div 
      className={`
        ${styles['padding-layout']}
        flex items-center justify-start relative top-40 w-full
      `}
    >
      <div
        className={`
          flex whitespace-nowrap relative 
          gap-x-1 gap-y-[5.5vw] md:gap-y-[5.5vw] lg:gap-y-[4.5vw] xl:gap-y-[4vw]
          h-auto w-auto *:min-w-56 *:bg-[#555] *:rounded-sm`
        }
      >
         {[...Array(7)].map((_, index) => (
          <div 
            key={index} 
            className={`box box-${index} animate-box gap-x-1`} 
            style={{ 
              animationDelay: `${index * .1}s`,
              transitionDelay:".5s" //--
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}



const Arrowleft = ({className, fn}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    width={24}
    viewBox="0 0 24 24"
    style={{zIndex:150}}
    className={className}
    onClick={()=> {fn()
    }}
    
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
)
export default Arrowleft

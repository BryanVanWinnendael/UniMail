const Spinner = ({size} : {size: number}) => {
  const width = size * 4
  const height = size * 4
  const border = size * 4 / 10

  return (
    <div style={{
      borderWidth: border + "px",
      width: width + "px",
      height: height + "px"
    }} className="border-gray-700 animate-spin rounded-full border-t-white" />
  )
}

export default Spinner
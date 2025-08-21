import { Perf } from 'r3f-perf'

// Performance monitor component
export const PerformanceMonitor = ({ visible = false }) => {
  if (!visible) return null
  
  return (
    <Perf 
      position="top-left"
      showGraph={false}
      minimal={true}
    />
  )
}

export default PerformanceMonitor

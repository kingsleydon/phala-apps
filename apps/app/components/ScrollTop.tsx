import {KeyboardArrowUp} from '@mui/icons-material'
import {Box, Fab, Fade, useScrollTrigger} from '@mui/material'
import {FC} from 'react'

const ScrollTop: FC = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 600,
  })

  const handleClick = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{position: 'fixed', bottom: 16, right: 16}}
      >
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </Box>
    </Fade>
  )
}
export default ScrollTop
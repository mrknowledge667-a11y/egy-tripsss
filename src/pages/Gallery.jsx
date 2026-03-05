import { motion } from 'framer-motion'
import { CinematicGallery } from '../components'

/**
 * Gallery Page
 * Immersive cinematic gallery showcasing Egypt's natural landscapes
 */
const Gallery = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <CinematicGallery />
    </motion.main>
  )
}

export default Gallery
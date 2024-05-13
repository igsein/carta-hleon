import React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import "./cssSlider/base.css"
import './cssSlider/sandbox.css'
import './cssSlider/embla.css'


const EmblaCarousel = (props) => {
  
  const OPTIONS = { align: 'start', loop: true, delay: 2000 }
  const SLIDE_COUNT = 2
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  console.log(SLIDES)
 
  const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [Autoplay()])

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
        {SLIDES.map((index) => (
            <div className="embla__slide embla__class-names" key={index}>
              <img
                className="embla__slide__img images-slider"
                src={`./assets/slider/${index}.jpg`}
                alt="Your alt text"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel

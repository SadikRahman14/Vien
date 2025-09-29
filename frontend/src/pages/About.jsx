import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {

  

  return (
    <div>

      <div className='text-3xl text-center pt-8 border-t-red-800'>
        <Title txt1={'ABOUT'} txt2={'US'}/>
      </div>
      

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt="About us"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Welcome to our store, where every collection begins with an idea: to
            create pieces that seamlessly blend quality, comfort, and timeless design.
            We believe that the things you use and wear every day should not only look
            beautiful but also feel effortless and last for years to come. That’s why
            we partner with trusted artisans and manufacturers who share our values of
            craftsmanship, sustainability, and attention to detail. Every product is
            carefully chosen to ensure it meets the high standards that our customers
            deserve.
          </p>
          <p>
            Our journey started with a small group of passionate creators who wanted
            to make everyday living more intentional. Over time, we grew into a
            community of makers and customers who believe in the same principle:
            thoughtful design can transform even the simplest moments into something
            meaningful. From the fabrics we source to the packaging you open, we
            strive to make each step of the process as responsible and rewarding as
            possible. Shopping with us is more than a transaction—it’s a shared
            experience built on trust and inspiration.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission is to empower people to live authentically by surrounding
            themselves with items that reflect their personality and values. We aim to
            provide more than products—we deliver stories, ideas, and moments that
            enrich your daily life. Whether you’re updating your wardrobe, refreshing
            your home, or searching for a meaningful gift, our promise is to always
            offer pieces that balance beauty, practicality, and responsibility. At the
            heart of everything we do is a commitment to creating lasting
            relationships with our customers, built on honesty, respect, and a shared
            love for exceptional design.
          </p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title txt1={'WHY'} txt2={'CHOOSE US'}/>
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 flex flex-col gap-5
                        transition-transform duration-500 ease-out
                        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg hover:border-gray-300">
          <b>Quality Assurance</b>
          <p className="text-gray-500"> Every product is carefully inspected to meet high standards of durability
      and performance. We partner with trusted makers to ensure you receive only
      the best.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 flex flex-col gap-5
                        transition-transform duration-500 ease-out
                        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg hover:border-gray-300">
          <b>Convenience</b>
          <p className="text-gray-500">From easy browsing to fast checkout and reliable delivery, we design every
      step of your shopping journey to be smooth, simple, and stress-free.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 flex flex-col gap-5
                        transition-transform duration-500 ease-out
                        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg hover:border-gray-300">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-500"> Our support team is always ready to help with quick responses, personalized
      solutions, and a genuine commitment to your satisfaction.</p>
        </div>
      </div>



      <NewsLetterBox/>

  </div>
  )
}

export default About
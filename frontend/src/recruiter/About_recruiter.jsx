import React from "react";
import Footer from "../users/components/Footer";
import Header from "./RecruiterHeader";

const About_recruiter = () => {
  return (
    <>
    <Header />

    <div className='container mx-auto flex flex-col gap-8 2xl:gap-14 py-6 px-16'>
      <div className='w-full flex flex-col-reverse md:flex-row gap-10 items-center p-5'>
        <div className='w-full md:2/3 2xl:w-2/4'>
          <h1 className='text-3xl text-blue-600 font-bold mb-5'>About Us</h1>
          <p className='text-justify leading-7'>
            Microsoft Corporation and its contributors are available at
            http://www.microsoft.com and at http://www.microsoft.com for more
            information about the contributors and contributors to the Microsoft
            Corporation and its contributors to the Microsoft Corporation and
            its contributors to the Microsoft Corporation
          </p>
        </div>
        <img src={"/images/bannerlanding.png"} alt='About' className='w-auto h-[300px]' />
      </div>

      <div className='leading-8 px-5 text-justify'>
        <p>
          Microsoft Corporation and its contributors are available at
          http://www.microsoft.com and at http://www.microsoft.com for more
          information about the contributors and contributors to the Microsoft
          Corporation and its contributors to the Microsoft Corporation and its
          contributors to the Microsoft Corporation Microsoft Corporation and
          its contributors are available at http://www.microsoft.com and at
          http://www.microsoft.com for more information about the contributors
          and contributors to the Microsoft Corporation and its contributors to
          the Microsoft Corporation and its contributors to the Microsoft
          Corporation Microsoft Corporation and its contributors are available
          at http://www.microsoft.com and at http://www.microsoft.com for more
          information about the contributors and contributors to the Microsoft
          Corporation and its contributors to the Microsoft Corporation and its
          contributors to the Microsoft Corporation Microsoft Corporation and
          its contributors are available at http://www.microsoft.com and at
          http://www.microsoft.com for more information about the contributors
          and contributors to the Microsoft Corporation and its contributors to
          the Microsoft Corporation and its contributors to the Microsoft
          Corporation Microsoft Corporation and its contributors are available
          at http://www.microsoft.com and at http://www.microsoft.com for more
        </p>
      </div>
    </div>
    <Footer/>
    </>

  );
};

export default About_recruiter;
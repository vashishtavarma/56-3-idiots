import React from 'react'
import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { createChapter } from '../../Api/chapters'

const CreateChapter = ({open,setOpen,journeyId}) => {

    const [chapterName, setChapterName] = useState('');
    const [chapter_no, setChapter_No] = useState(null);
    const [description, setDescription] = useState('');
    const [videoLink, setVideoLink] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const chapterData = {
        title: chapterName,
        description,
        video_link: videoLink,
        chapter_no: chapter_no, 
      };

    try {
        const response = await createChapter(journeyId,chapterData)
        console.log(response);
           // Clear form
           setOpen(!open)
           setChapterName('');
           setDescription('');
           setVideoLink('');
    } catch (error) {
      console.log(error);
    }
  
      
    };
   
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-card text-foreground text-left shadow-xl border border-border transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            style={{ backgroundColor: 'var(--card)' }}
          >
           
      
      <div className="w-full p-6 bg-card rounded-lg shadow border border-border md:mt-0 sm:max-w-md sm:p-8 text-card-foreground" style={{ backgroundColor: 'var(--card)' }}>
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight md:text-2xl">
              Create New Chapter
          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="chapterName" className="block mb-2 text-sm font-medium text-foreground">
            Chapter Name
          </label>
          <input
            type="text"
            id="chapterName"
            name="chapterName"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
            placeholder="Chapter name"
            required
          />
        </div>
        <div>
          <label htmlFor="cno" className="block mb-2 text-sm font-medium text-foreground">
            Chapter Number
          </label>
          <input
            type="number"
            id="cno"
            name="cno"
            value={chapter_no}
            onChange={(e) => setChapter_No(e.target.value)}
            className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
            placeholder="Chapter number"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Start writing..."
            className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label htmlFor="videoLink" className="block mb-2 text-sm font-medium text-foreground">
            YouTube Video Link
          </label>
          <input
            type="text"
            id="videoLink"
            name="videoLink"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="https://youtube.com/..."
            className="bg-background border border-input text-foreground placeholder:text-muted-foreground text-sm rounded-lg focus:ring-0 block w-full p-2.5"
            required
          />
          <p className='text-sm text-foreground'> <span className='text-yellow-500 font-semibold'> Note:</span> To get youtube video url  <br /> {'click on 3 dots -> share -> copy url'}</p>
        </div>

        <button
          type="submit"
          className="w-full text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Done
        </button>
      </form>
      </div>


 
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default CreateChapter

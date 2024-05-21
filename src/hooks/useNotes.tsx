import { useState } from 'react'
import { NoteType } from '../pages/NotePage';

type useNoteReturnType = {
  notes: NoteType[],
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>,
  fetchAllNotes: () => void,
  createNewNote: ({noteTitle, setNoteTitle}: createNoteProps ) => void

}

type createNoteProps = {
  noteTitle: string,
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>
}



export const useNotes = (): useNoteReturnType => {
    const[notes, setNotes] = useState<NoteType[]>([]);
    
    const fetchAllNotes = async() => {
        try{
          const res = await fetch('http://localhost:8000/note/getAllNotes', {
            method: 'GET',
            headers:{
              "Content-Type": "application/json",
              "authorization": localStorage.getItem("authToken")!
            }
          })
          if(res.ok){
            const data = await res.json();
            setNotes(data) 
          }
    
        }
        catch(error: any){
          console.log(error.message)
        }
    }
    
    const createNewNote = async({noteTitle, setNoteTitle}: createNoteProps) => {
      try{
       
        const createNoteParameter = {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json',
            "authorization": localStorage.getItem("authToken")!
          },
          body: JSON.stringify({title: noteTitle})
        }
        const res = await fetch('http://localhost:8000/note/createNotes', createNoteParameter)
        if (res.ok){
          const data = await res.json();
  
          const newNote: NoteType  = {
            _id: data.note_id,
            title: noteTitle,
            isOpen: false
          }
  
          setNotes((prevNotes) => [...prevNotes, newNote]);
          setNoteTitle('');
  
        }
      }
      catch(error: any){
        console.log(error.message)
      }
    }


    return {notes, setNotes, fetchAllNotes, createNewNote};
}
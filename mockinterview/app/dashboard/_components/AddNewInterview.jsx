"use client"
import React,{useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment'
import { db } from '@/utils/db'

function AddNewInterview() {
  const [openDialog,setOpenDialog]=useState(false)
  const [jobPosition,setJobPosition]=useState();
  const [jobDesc,setJobDesc]=useState();
  const [jobExperience,setJobExperience]=useState();
  const [loading,setLoading]=useState(false);
  const [jsonResponse,setJsonResponse]=useState([]);
  const {user}=useUser();

  const onSubmit=async(e)=>{
    setLoading(true)
    e.preventDefault()
    console.log(jobPosition,jobDesc,jobExperience);
    const InputPrompt="Job position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience: "+jobExperience+". Based on this information give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION+" interview questions along with answers in json format. Give Question and Answer as field in JSON"
    const result= await chatSession.sendMessage(InputPrompt);
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','');
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);
    
    if(MockJsonResp)
    {
    
    const resp=await db.insert(MockInterview)
    .values({
      mockId:uuidv4(),
      jsonMockResp:MockJsonResp,
      jobPosition:jobPosition,
      jobDesc:jobDesc,
      jobExperience:jobExperience,
      createdBy:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD-MM-yyyy')
    }).returning({mockId:MockInterview.mockId})

    console.log("Inserted ID:",resp)
  }
  else{
    console.log("ERROR");
  }
    setLoading(false);  
  }
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
      onClick={()=>setOpenDialog(true)}>
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
      
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className="text-2xl">Tell us more about your job you are interviewing</DialogTitle>
          <form onSubmit={onSubmit}>
            <div>
              <h2>Add details about your job position, job description and experience</h2>
            <div className='mt-7 my-3'>
              <label>Job Role/Job Position</label>
              <Input placeholder="Ex. Full Stack Developer" required
              onChange={(event)=>setJobPosition(event.target.value)}/>
            </div>
            <div className='my-3'>
              <label>Job Description/Tech Stack</label>
              <Textarea placeholder="Ex. React, Angular, NodeJs, MySql etc" required
              onChange={(event)=>setJobDesc(event.target.value)}/>
            </div>
            <div className='my-3'>
              <label>Years of experience</label>
              <Input placeholder="Ex. 5" type="number" required
              onChange={(event)=>setJobExperience(event.target.value)}/>
            </div>
            </div>
          <div className='flex gap-5 justify-end'>
            <Button  type='button' variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type='submit' disabled={loading}>
              {loading?
              <>  
              <LoaderCircle className='animate-spin'/>Generating from AI
              </>:'Start Interview'
              }</Button>
          </div>
          </form>
        </DialogHeader>
      </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview

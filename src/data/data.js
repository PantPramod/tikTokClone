const item={
    src:"https://source.unsplash.com/1400x700/?mountain,river"
  }
const DATA=[]
  for(let i=0; i<102;i++){
   DATA.push(
    {
        id: i.toString(),
        title: `Item ${i+1}`,
        src:`https://source.unsplash.com/100x100/?nature,water+${i}`
      }   
   )
  }

  export {DATA};
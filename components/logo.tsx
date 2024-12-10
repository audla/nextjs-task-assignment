const Text = ({className}:{className?:string})=>{
  return (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 1752.333 325.586">
 
  <path id="Path_68499" data-name="Path 68499" d="M108.16,324.212H.962C2.043,323.634,145.716.735,145.743,0H249.168C249.028,3.87,108.16,324.212,108.16,324.212Z" transform="translate(-0.962 1)" fill="#D0051A"/>
  <path id="Rectangle_1051_-_Outline" data-name="Rectangle 1051 - Outline" d="M60.635,0,196.15,324.89H68.855L0,142.782Z" transform="translate(221.179)" fill="#D0051A"/>
  <path fill="currentColor" id="Path_68500" data-name="Path 68500" d="M109.3,269.57Q75.005,254.558,56.125,225.3t-18.9-71.285V0h74.2V152.073q0,23.834,9.105,40.488a58.965,58.965,0,0,0,26.542,25.183q17.422,8.54,43.394,8.53,25.56,0,43.2-8.53a57.709,57.709,0,0,0,26.542-25.183q8.9-16.663,8.907-40.488V0h74.39V154.017q0,42.03-18.786,71.186T271.538,269.47q-34.383,15.116-81.065,15.116-46.9,0-81.174-15.017" transform="translate(402.074 40.999)"/>
  <path fill="currentColor" id="Path_68501" data-name="Path 68501" d="M72.719,0H227.886Q279.81,0,315.735,16.08q35.945,16.083,54.731,46.975t18.786,75.064v.387q0,45.155-18.786,76.721t-54.731,47.947q-35.93,16.366-87.849,16.366H72.719ZM222.847,222.973q29.444,0,49.593-9.294t30.609-27.7q10.459-18.419,10.464-46.3v-.4q0-26.914-10.176-45.328T273.026,66.06q-20.145-9.492-50.178-9.492H146.91v166.4Z" transform="translate(718.588 45.998)"/>
  <path fill="currentColor" id="Path_68502" data-name="Path 68502" d="M108.382,0h74.191V222.784H347.828v56.764H108.382Z" transform="translate(1036.655 45.999)"/>
  <path fill="currentColor" id="Path_68503" data-name="Path 68503" d="M356.219,0H262.885L134.24,279.507H212.5l27.673-63.479H378.933l27.673,63.479h78.456ZM262.091,166.038,309.006,58.52h1.388l46.816,107.518Z" transform="translate(1267.271 46)"/>
</svg>



  )
}

export const Mark = ({className}:{className?:string})=>(<svg className={className} xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 258.638 201.505">

<path id="Path_68499" data-name="Path 68499" d="M65.6,201.084H0C.668,200.727,90.1.455,90.116,0h63.95C153.979,2.393,68.756,199.4,65.6,201.084Z" transform="translate(0 0)" fill="#D0051A"/>
<path id="Rectangle_1051_-_Outline" data-name="Rectangle 1051 - Outline" d="M37.492,0l83.792,201.5H42.574L0,88.285Z" transform="translate(137.354 0.001)" fill="#D0051A"/>
</svg>)

export default function AudlaLogo({ className, markOnly=false }:{
  className?:string,
  markOnly?:boolean
}){
  return (<div className={`flex items-center  gap-2 `}>

{
  markOnly ?(
    <Mark className={className}/>
  ): (
      <Text className={className} />
      )
}
</div>
)}
  
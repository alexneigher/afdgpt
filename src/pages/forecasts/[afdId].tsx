import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "~/components/loading";
import { dropdownOptions } from "~/lib/dropdown-options";

import { api } from "~/utils/api";

export default function Forecast() {
  const router = useRouter();
  const { afdId } = router.query;
  const [afdText, setAfdText] = useState<string | undefined>(undefined);
  const [summaryText, setSummaryText] = useState<string | undefined>(undefined);

  const afdUrl = dropdownOptions.find((o) => o.name == afdId)?.value

  const rawResponse = api.post.getAfd.useQuery({id : afdId as string});  
  const response = api.post.summarize.useQuery({text: afdUrl ? afdUrl : ""});

  useEffect(() => { 
    if (rawResponse.data){
      setAfdText(rawResponse.data)
    }
    if (response.data){
      setSummaryText(response.data)
    }
  }, [rawResponse.data, response.data])

  return (
  <>
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex flex-col gap-12 px-4 py-16 ">
        <Link href="/">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            AFD<span className="text-[hsl(280,100%,70%)]">
              <em>GPT</em></span>
          </h1>
        </Link>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <div className="text-lg">
              {afdText ?
                <div dangerouslySetInnerHTML={{ __html: afdText }} />
             : <Loading/>}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
            <div className="text-lg text-white">
              <h3 className="mb-2 w-full font-bold text-t3-purple-50 text-3xl"> Summary </h3>
              {summaryText ? summaryText : <Loading/>}
            </div>
          </div>
        </div>
      </div>
    </main>
  </>)
}
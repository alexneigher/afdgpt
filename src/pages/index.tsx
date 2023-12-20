import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import Dropdown from "~/components/dropdown";

import { api } from "~/utils/api";

export default function Home() {
  const [ afdSelected, setAfdSelected ] = useState<string | undefined>(undefined);
  const [ summaryIsLoading, setSummaryIsLoading ] = useState<boolean>(false);
  const [ summary, setSummary ] = useState<string | undefined>(undefined);

  const handleDropdownChange = async (value: string) => {
    const option = dropdownOptions.find((o) => o.value == value)?.value
    setAfdSelected(option ?? undefined)
    setSummaryIsLoading(true)
  };
  
  const response = api.post.hello.useQuery({text: afdSelected ? afdSelected : ""});

  useEffect(() => { 
    if (response.data){
      setSummaryIsLoading(false)
      setSummary(response.data)
    }
  }, [response.data])


  const dropdownOptions = [
    { value: 'https://forecast.weather.gov/product.php?site=STO&issuedby=STO&product=AFD&format=TXT&version=1&glossary=0', label: 'Sacramento, CA' },
    { value: 'https://forecast.weather.gov/product.php?site=NWS&issuedby=REV&product=AFD&format=TXT&version=1&glossary=0', label: 'Reno, NV' },
    // Add more options as needed
  ];

  return (
    <>
      <Head>
        <title>AFDGPT
        </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            AFD<span className="text-[hsl(280,100%,70%)]">
              <em>GPT</em></span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">What is this?</h3>
              <div className="text-lg">
                Area Forecast Discussions are complex, technical, and full of meteorological jargon. AFDGPT is a tool to help simplify the process of reading and understanding AFDs.
              </div>
            </Link>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
              <h3 className="text-2xl text-white font-bold">Select Area Forecast</h3>
              <Dropdown options={dropdownOptions} onChange={handleDropdownChange}/>
            </div>
          </div>
          <div className="text-2xl text-white">
            { afdSelected ? (
              <div className="flex flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
                <h3 className="text-2xl text-white font-bold">
                  AFD for{' '}
                  <Link classname="underline" href={dropdownOptions.find((o) => o.value == afdSelected)?.value} target="_blank">
                    {
                      dropdownOptions.find((o) => o.value == afdSelected)?.label
                    }
                  </Link>
                </h3>
                {summaryIsLoading ? ("Summarizing..."):(summary)}
              </div>
            ):"No AFD Selected"
            }
          </div>

        </div>
      </main>
    </>
  );
}
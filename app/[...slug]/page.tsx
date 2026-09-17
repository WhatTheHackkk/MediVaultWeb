import MediVaultDashboard from "@/components/medivault-dashboard";
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params; return <MediVaultDashboard section={slug?.[0]||"overview"}/>}

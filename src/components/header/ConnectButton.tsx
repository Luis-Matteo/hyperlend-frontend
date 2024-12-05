import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useEnsAvatar, useEnsName } from "wagmi"
import { formatAddress } from "../../utils/functions"
export default function ConnectButton() {
    const { isConnected, address } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
    const { open } = useWeb3Modal()

    return (
        <button
            className=""
            onClick={() => open()}>
            {
                isConnected ?
                    <div className="py-2 px-8 rounded-full border-2 text-white border-transparent font-lufga font-bold flex gap-2">
                        {ensAvatar &&
                            <img className="" src={ensAvatar} />
                        }
                        <p className="">
                            {ensName ?
                                ensName
                                :
                                address ?
                                    formatAddress(address) : ""}
                        </p>
                    </div>
                    :
                    <p className="py-2 px-8 rounded-full text-secondary border-secondary border-2 font-lufga font-bold">
                        Connect Wallet
                    </p>
            }
        </button>
    )
}
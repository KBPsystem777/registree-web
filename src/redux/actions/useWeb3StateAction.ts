import {useDispatch} from "react-redux";
import {setAccount, setProvider, setChainId, setWeb3Modal} from "../web3Reducer";

export const useWeb3StateAction = () => {
    const dispatch = useDispatch();

    const updateAccount = (val:any) => {
        dispatch(setAccount(val));
    }

    const updateProvider = (val:any) => {
        dispatch(setProvider(val));
    }

    const updateChainId = (val:any) => {
        dispatch(setChainId(val));
    }
    const updateWeb3Modal = (val:any) => {
        dispatch(setWeb3Modal(val));
    }

    return {
        updateAccount,
        updateProvider,
        updateChainId,
        updateWeb3Modal,
    }
}
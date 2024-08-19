import {useDispatch} from "react-redux";
import {setRemoveHeaderBorder, setHeaderHeight, setActiveTab, setLookupStatus} from "../utilReducer";
export const useUtilStateAction = () => {
    const dispatch = useDispatch();

    const updateRemoveHeaderBorder = (val:boolean) => {
        dispatch(setRemoveHeaderBorder(val));
    }
    const updateHeaderHeight = (val:number) => {
        dispatch(setHeaderHeight(val));
    }
    const updateActiveTab = (val:string) => {
        dispatch(setActiveTab(val));
    }
    const updateLookupStatus = (val:boolean) => {
        dispatch(setLookupStatus(val));
    }

    return {
        updateRemoveHeaderBorder,
        updateHeaderHeight,
        updateActiveTab,
        updateLookupStatus,
    }
}
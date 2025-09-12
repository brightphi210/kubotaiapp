import { Text, TouchableOpacity } from "react-native";


interface ButtonProps {
    text: string;
    onPress?: () => void;
}
export const SolidMainButton = ({text, onPress, ...props}: ButtonProps)=>{
    return (
        <TouchableOpacity {...props} onPress={onPress} className="flex items-center gap-4 bg-[#016FEC] p-4 py-5 w-full rounded-lg">
            <Text className="text-white text-[13px]" style={{fontFamily: 'HankenGrotesk_700Bold'}}>{text}</Text>
        </TouchableOpacity>
    )
}


export const SolidMainButtonInactive = ({text, onPress, ...props}: ButtonProps)=>{
    return (
        <TouchableOpacity {...props} onPress={onPress} className="flex opacity-40 items-center gap-4 bg-[#016FEC] p-4 py-5 w-full rounded-lg">
            <Text className="text-white text-[13px]" style={{fontFamily: 'HankenGrotesk_400Regular'}}>{text}</Text>
        </TouchableOpacity>
    )
}


export const LightBlue = ({text, onPress, ...props}: ButtonProps)=>{
    return (
        <TouchableOpacity {...props} onPress={onPress} className="flex items-center gap-4 bg-[#DEECFD] p-4 py-2.5 rounded-full">
            <Text className="text-[#016FEC] text-[10px]" style={{fontFamily: 'HankenGrotesk_400Regular'}}>{text}</Text>
        </TouchableOpacity>
    )
}


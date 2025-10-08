import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";


interface ButtonProps {
    text?: string;
    description?: string;
    onPressBtn?: () => void;
    icon?: keyof typeof MaterialIcons.glyphMap;
}
export const OnboardHeader = ({text, description}: ButtonProps)=>{
    return (
        <View className="">
            <Text className="text-black text-xl" style={{fontFamily: 'HankenGrotesk_600SemiBold'}}>{text}</Text>
            <Text className="text-neutral-600 text-base pt-2" style={{fontFamily: 'HankenGrotesk_400Regular'}}>{description}</Text>
        </View>
    )
}
import { StyleProp, View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

type RemoteLottieProps = {
  uri: string;
  style?: StyleProp<ViewStyle>;
  autoPlay?: boolean;
  loop?: boolean;
};

export default function RemoteLottie({ uri, style, autoPlay = true, loop = true }: RemoteLottieProps) {
  if (!uri) return null;

  return (
    <View style={style}>
      <LottieView source={{ uri }} autoPlay={autoPlay} loop={loop} />
    </View>
  );
}

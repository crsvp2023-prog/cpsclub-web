import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Text } from '@/components/Themed';
import { CPSC_LOGO_XML } from '@/assets/images/cpscLogo';

export default function AppHeader({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <SvgXml xml={CPSC_LOGO_XML} width={22} height={22} />
      </View>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Chatswood Premier Sports Club</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#0B1B3A',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 10,
    color: '#C7D7FF',
  },
});

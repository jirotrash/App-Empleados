import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
};

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'SATEX TEXTIL', subtitle = 'Gestión de Empleados/Productividad' }) => {
  return (
    <ImageBackground source={require('../../assets/Logo-Satex.png')} style={styles.background} imageStyle={styles.imageBackground}>
      <View style={styles.overlay}>
        <View style={styles.brand}>
          <Text style={styles.title}>{title}</Text>
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Reduced header height and padding to make it smaller
  background: { width: '100%', paddingTop: spacing.md, paddingBottom: spacing.xs },
  imageBackground: { resizeMode: 'cover' },
  // Make overlay slightly more transparent so background image is subtler
  overlay: { padding: spacing.sm, backgroundColor: 'rgba(47,128,237,0.72)', borderBottomWidth: 2, borderBottomColor: colors.primaryDark },
  brand: { flexDirection: 'row', alignItems: 'center' },
  title: { color: '#fff', fontWeight: '800', fontSize: fontSizes.md },
  subtitle: { color: 'rgba(255,255,255,0.95)', marginTop: 4, fontSize: fontSizes.sm },
  // removed blur-specific styles
});

export default AppHeader;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { palette, radius, shadow, spacing, typography } from '../theme/tokens';
import { NEON_COLORS } from '../utils/colors';

export default function QuickActionCard({ title, subtitle, color = NEON_COLORS.neonCyan, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.wrapper, { shadowColor: color }]}> 
      <View style={[styles.card, { borderLeftColor: color }]}> 
        <View style={styles.content}> 
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={[styles.circle, { backgroundColor: color }]}> 
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...shadow.soft,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    borderLeftWidth: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingRight: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.neon,
  },
  arrow: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

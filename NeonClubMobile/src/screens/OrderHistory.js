import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { NEON_COLORS } from '../utils/colors';

const chevronLeftSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
const downloadSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;
const checkCircleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const videoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7 16 12l7 5V7Z"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.174 0l-3.58 2.687a.5.5 0 0 1-.81-.47l1.515-8.526"/><circle cx="12" cy="8" r="6"/></svg>`;
const indianRupeeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>`;

const OrderHistory = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [pressedButton, setPressedButton] = useState(null);

  const orders = [
    {
      id: 'ORD-2024-10-001',
      type: 'mentor-session',
      title: 'Mentorship Session with Dr. Anjali Reddy',
      subtitle: 'Advanced Wound Care',
      date: '2024-10-16',
      time: '3:00 PM',
      amount: 1999,
      status: 'upcoming',
      points: 200,
      icon: videoSvg,
      iconColor: '#A855F7',
      iconBg: '#F3E8FF',
    },
    {
      id: 'ORD-2024-10-002',
      type: 'course',
      title: 'Advanced Patient Care',
      subtitle: '8 weeks course',
      date: '2024-10-10',
      amount: 4999,
      status: 'completed',
      points: 500,
      icon: bookOpenSvg,
      iconColor: '#3B82F6',
      iconBg: '#EFF6FF',
    },
    {
      id: 'ORD-2024-09-003',
      type: 'workshop',
      title: 'Wound Care Management Workshop',
      subtitle: 'Live Workshop',
      date: '2024-09-28',
      amount: 1499,
      status: 'completed',
      points: 150,
      icon: awardSvg,
      iconColor: '#10B981',
      iconBg: '#ECFDF5',
    },
    {
      id: 'ORD-2024-09-004',
      type: 'event',
      title: 'Healthcare Summit 2024',
      subtitle: '3-Day Conference',
      date: '2024-09-15',
      amount: 2999,
      status: 'completed',
      points: 300,
      icon: calendarSvg,
      iconColor: '#F59E0B',
      iconBg: '#FFFBEB',
    },
    {
      id: 'ORD-2024-09-005',
      type: 'mentor-session',
      title: 'Mentorship Session with Dr. Sunita Verma',
      subtitle: 'Critical Care',
      date: '2024-09-05',
      time: '2:00 PM',
      amount: 1999,
      status: 'completed',
      points: 200,
      icon: videoSvg,
      iconColor: '#A855F7',
      iconBg: '#F3E8FF',
    },
  ];

  const upcomingOrders = orders.filter(o => o.status === 'upcoming');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalPoints = orders.reduce((sum, order) => sum + order.points, 0);

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingOrders;
      case 'completed':
        return completedOrders;
      default:
        return orders;
    }
  };

  const handleDownloadInvoice = (orderId) => {
    Alert.alert('Download Invoice', `Downloading invoice for ${orderId}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#A855F7', '#EC4899', '#F59E0B']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgXml xml={chevronLeftSvg} width={24} height={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <View style={styles.summaryValue}>
              <SvgXml xml={indianRupeeSvg} width={16} height={16} color="#FFFFFF" />
              <Text style={styles.summaryText}>{totalSpent.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Points Earned</Text>
            <Text style={styles.summaryText}>{totalPoints}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({orders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <View style={styles.ordersContainer}>
        {getFilteredOrders().map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={[styles.iconContainer, { backgroundColor: order.iconBg }]}>
                <SvgXml xml={order.icon} width={20} height={20} color={order.iconColor} />
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderTitle}>{order.title}</Text>
                <Text style={styles.orderSubtitle}>{order.subtitle}</Text>
                <View style={styles.orderMeta}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <SvgXml xml={calendarSvg} width={12} height={12} color="#6B7280" />
                      <Text style={styles.orderDate}>
                        {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {order.time && ` • ${order.time}`}
                      </Text>
                    </View>
                    {order.status === 'upcoming' && (
                      <View style={styles.statusBadgeUpcoming}>
                        <SvgXml xml={clockSvg} width={12} height={12} color="#059669" />
                        <Text style={styles.statusTextUpcoming}>Upcoming</Text>
                      </View>
                    )}
                  </View>
              </View>
              {order.status === 'completed' && (
                <View style={styles.statusContainer}>
                  <View style={styles.statusBadgeCompleted}>
                    <SvgXml xml={checkCircleSvg} width={12} height={12} color="#2563EB" />
                    <Text style={styles.statusTextCompleted}>Completed</Text>
                  </View>
                </View>
              )}
            </View>


            {order.status === 'completed' && (
              <View style={styles.orderDetails}>
                <View style={styles.orderIdContainer}>
                  <Text style={styles.orderIdLabel}>Order ID</Text>
                  <Text style={styles.orderId}>{order.id}</Text>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Amount Paid</Text>
                  <View style={styles.amountValue}>
                    <SvgXml xml={indianRupeeSvg} width={12} height={12} color="#1F2937" />
                    <Text style={styles.amountText}>{order.amount}</Text>
                  </View>
                  <Text style={styles.pointsText}>+{order.points} points earned</Text>
                </View>
              </View>
            )}

           
            {order.status === 'completed' && (
              <TouchableOpacity
                style={[styles.downloadButton, pressedButton === order.id && { backgroundColor: '#DBEAFE' }]}
                onPress={() => handleDownloadInvoice(order.id)}
                onPressIn={() => setPressedButton(order.id)}
                onPressOut={() => setPressedButton(null)}
              >
                <SvgXml xml={downloadSvg} width={16} height={16} color={pressedButton === order.id ? '#2563EB' : '#000000'} />
                <Text style={[styles.downloadText, pressedButton === order.id && { color: '#2563EB' }]}>Download Invoice</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
  },
  ordersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  orderSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  orderMeta: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadgeUpcoming: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextUpcoming: {
    fontSize: 10,
    color: '#059669',
    marginLeft: 2,
    fontWeight: '500',
  },
  statusBadgeCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextCompleted: {
    fontSize: 10,
    color: '#2563EB',
    marginLeft: 4,
    fontWeight: '500',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  orderId: {
    fontSize: 12,
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  amountValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 12,
    color: '#1F2937',
    marginLeft: 2,
  },
  pointsText: {
    fontSize: 10,
    color: '#059669',
    marginTop: 2,
  },
  downloadButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  downloadText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  upcomingCardFooter: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 12,
  },
  upcomingCardFooterText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default OrderHistory;
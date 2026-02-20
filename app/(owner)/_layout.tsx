import { getRestaurant } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { Tabs } from 'expo-router';
import { BarChart3, Grid3X3, LayoutDashboard, Settings, UtensilsCrossed } from 'lucide-react-native';

export default function OwnerLayout() {
    const { user } = useAuthStore();
    const restaurant = user ? getRestaurant(user.restaurantId) : null;
    const primary = restaurant?.theme.primary ?? '#FF4B3A';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: primary,
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#F0F0F0',
                    height: 85,
                    paddingBottom: 20,
                    paddingTop: 8,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="menu-manage"
                options={{
                    title: 'Menu',
                    tabBarIcon: ({ color }) => <UtensilsCrossed size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="tables"
                options={{
                    title: 'Tables',
                    tabBarIcon: ({ color }) => <Grid3X3 size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Analytics',
                    tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="onboarding"
                options={{ href: null, headerShown: false }}
            />
        </Tabs>
    );
}

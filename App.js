import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TournamentsScreen from './src/screens/TournamentsScreen';
import RankingsScreen from './src/screens/RankingsScreen';
import CalendarScrimsScreen from './src/screens/CalendarScrimsScreen';

const MENU_ITEMS = [
  { key: 'TOURNAMENTS', label: 'TOURNAMENTS' },
  { key: 'RANKINGS', label: 'RANKINGS' },
  { key: 'VIDEOS', label: 'VIDEOS' },
  { key: 'THIRD_PARTY', label: '3RD PARTY TOURNAMENTS' },
  { key: 'CALENDAR', label: 'CALENDAR' },
];

const OPEN_LABELS = {
  TOURNAMENTS: 'Open BGMI Tournaments →',
  RANKINGS: 'Open BGMI Rankings →',
  CALENDAR: 'Open BGMI Calendar & Scrims →',
};

export default function App() {
  const [activeView, setActiveView] = useState('MENU'); // 'MENU' | 'TOURNAMENTS' | 'RANKINGS' | 'CALENDAR'
  const [selectedSection, setSelectedSection] = useState('TOURNAMENTS');
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' | 'SIGNUP'
  const [ign, setIgn] = useState('');
  const [email, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalVisible(true);
  };

  const handleAuthSubmit = () => {
    if (!email.trim()) return;
    setCurrentUser({
      ign: ign.trim() || 'BGMI_Player',
      email: email.trim(),
    });
    setIgn('');
    setEmail('');
    setAuthModalVisible(false);
  };

  const handleMenuPress = (key) => {
    setSelectedSection(key);
    if (OPEN_LABELS[key]) {
      setActiveView(key);
    }
  };

  const handleOpenSelected = () => {
    if (OPEN_LABELS[selectedSection]) {
      setActiveView(selectedSection);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0d0d0d" />

      {activeView === 'TOURNAMENTS' ? (
        <TournamentsScreen onBack={() => setActiveView('MENU')} />
      ) : activeView === 'RANKINGS' ? (
        <RankingsScreen onBack={() => setActiveView('MENU')} />
      ) : activeView === 'CALENDAR' ? (
        <CalendarScrimsScreen
          onBack={() => setActiveView('MENU')}
          currentUser={currentUser}
        />
      ) : (
        <>
          {/* Top Header matching dark esports menu style */}
          <View style={styles.header}>
            <View>
              <Text style={styles.brandMain}>BHARAT ESPORTS</Text>
              <View style={styles.brandSubRow}>
                <View style={styles.gameBadge}>
                  <Text style={styles.gameBadgeText}>BGMI</Text>
                </View>
                <Text style={styles.brandSub}>INDIA ESPORTS HUB</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedSection('TOURNAMENTS')}
              style={styles.closeBtn}
              accessibilityLabel="Reset selection"
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Main Navigation List + Active BGMI Preview */}
          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {currentUser && (
              <View style={styles.userBanner}>
                <Text style={styles.userBannerText}>
                  Signed in as {currentUser.ign} ({currentUser.email})
                </Text>
              </View>
            )}

            <View style={styles.navList}>
              {MENU_ITEMS.map((item) => {
                const active = selectedSection === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => handleMenuPress(item.key)}
                    style={styles.navItem}
                  >
                    <Text style={[styles.navText, active && styles.navTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick BGMI Section Preview Card */}
            <View style={styles.previewCard}>
              <Text style={styles.previewTag}>
                SELECTED: {selectedSection.replace('_', ' ')}
              </Text>
              <Text style={styles.previewTitle}>BGMI Competitive Circuit</Text>
              <Text style={styles.previewDesc}>
                Ready for Bharat Esports BGMI brackets, squads, point decay leaderboards, and custom scrims.
              </Text>

              {OPEN_LABELS[selectedSection] && (
                <TouchableOpacity style={styles.launchBtn} onPress={handleOpenSelected}>
                  <Text style={styles.launchBtnText}>{OPEN_LABELS[selectedSection]}</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Bottom Log In & Sign Up Buttons */}
          <View style={styles.footerAuth}>
            <TouchableOpacity style={styles.loginBtn} onPress={() => openAuth('LOGIN')}>
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn} onPress={() => openAuth('SIGNUP')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Auth Modal */}
      <Modal
        visible={authModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAuthModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {authMode === 'LOGIN' ? 'Log In to Bharat Esports' : 'Create Bharat Esports Account'}
            </Text>

            {authMode === 'SIGNUP' && (
              <TextInput
                style={styles.input}
                placeholder="BGMI In-Game Name (IGN)"
                placeholderTextColor="#777"
                value={ign}
                onChangeText={setIgn}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email or Mobile ID"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setAuthModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleAuthSubmit}>
                <Text style={styles.confirmText}>
                  {authMode === 'LOGIN' ? 'Log In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandMain: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  brandSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  gameBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  gameBadgeText: {
    color: '#0d0d0d',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSub: {
    color: '#d4d4d4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: '#e5e5e5',
    fontSize: 22,
    fontWeight: '400',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  userBanner: {
    backgroundColor: '#1a1a1a',
    borderColor: '#f5b800',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 18,
  },
  userBannerText: {
    color: '#f5b800',
    fontSize: 13,
    fontWeight: '600',
  },
  navList: {
    gap: 22,
  },
  navItem: {
    paddingVertical: 2,
  },
  navText: {
    color: '#c7c7c7',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  navTextActive: {
    color: '#ffffff',
  },
  previewCard: {
    marginTop: 32,
    backgroundColor: '#161616',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  previewTag: {
    color: '#f5b800',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  previewDesc: {
    color: '#a3a3a3',
    fontSize: 13,
    lineHeight: 19,
  },
  launchBtn: {
    marginTop: 14,
    backgroundColor: '#f5b800',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  launchBtnText: {
    color: '#0d0d0d',
    fontSize: 13,
    fontWeight: '800',
  },
  footerAuth: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
    gap: 12,
    backgroundColor: '#0d0d0d',
  },
  loginBtn: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  loginText: {
    color: '#e5e5e5',
    fontSize: 16,
    fontWeight: '600',
  },
  signupBtn: {
    backgroundColor: '#f5b800',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  signupText: {
    color: '#0d0d0d',
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#161616',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2b2b2b',
    gap: 12,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#0d0d0d',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#262626',
  },
  cancelText: {
    color: '#d4d4d4',
    fontWeight: '600',
  },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#f5b800',
  },
  confirmText: {
    color: '#0d0d0d',
    fontWeight: '800',
  },
});

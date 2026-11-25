import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import {
  BGMI_CALENDAR_EVENTS,
  INITIAL_SCRIM_SLOTS,
} from '../data/bgmiCalendarScrims';

export default function CalendarScrimsScreen({ onBack, currentUser }) {
  const [activeTab, setActiveTab] = useState('CALENDAR'); // 'CALENDAR' | 'SCRIMS'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scrims, setScrims] = useState(INITIAL_SCRIM_SLOTS);

  const squadLabel = currentUser?.ign ? currentUser.ign.toUpperCase() : 'MY SQUAD';

  const toggleSlotClaim = (scrimId) => {
    setScrims((prev) =>
      prev.map((room) => {
        if (room.id !== scrimId) return room;
        const alreadyClaimed = room.claimedBy.includes(squadLabel);
        if (alreadyClaimed) {
          return {
            ...room,
            claimedBy: room.claimedBy.filter((name) => name !== squadLabel),
          };
        }
        if (room.claimedBy.length >= room.totalSlots) return room;
        return {
          ...room,
          claimedBy: [...room.claimedBy, squadLabel],
        };
      })
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← MENU</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>CALENDAR & SCRIMS</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Mode Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'CALENDAR' && styles.tabBtnActive]}
          onPress={() => setActiveTab('CALENDAR')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'CALENDAR' && styles.tabTextActive,
            ]}
          >
            SCHEDULE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SCRIMS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('SCRIMS')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'SCRIMS' && styles.tabTextActive,
            ]}
          >
            SCRIM SLOTS
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {activeTab === 'CALENDAR' ? (
          BGMI_CALENDAR_EVENTS.map((ev) => (
            <TouchableOpacity
              key={ev.id}
              style={styles.card}
              onPress={() => setSelectedEvent(ev)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <Text style={styles.dateText}>
                  {ev.date} • {ev.time}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{ev.type}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{ev.title}</Text>
              <Text style={styles.mapsText}>Maps: {ev.maps}</Text>
              <Text style={styles.tapText}>Tap for lobby & check-in info →</Text>
            </TouchableOpacity>
          ))
        ) : (
          <>
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>
                Booking as: <Text style={styles.highlight}>{squadLabel}</Text>
              </Text>
            </View>

            {scrims.map((room) => {
              const claimedCount = room.claimedBy.length;
              const openSlots = room.totalSlots - claimedCount;
              const isClaimedByUser = room.claimedBy.includes(squadLabel);

              return (
                <View key={room.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardTitle}>{room.session}</Text>
                    <Text style={styles.dateText}>{room.time}</Text>
                  </View>

                  <Text style={styles.mapsText}>Maps: {room.maps}</Text>
                  <Text style={styles.slotCounter}>
                    Slots Taken: {claimedCount} / {room.totalSlots} ({openSlots} open)
                  </Text>

                  <Text style={styles.claimedList} numberOfLines={2}>
                    Squads: {room.claimedBy.join(', ') || 'None yet'}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      isClaimedByUser && styles.actionBtnRelease,
                    ]}
                    onPress={() => toggleSlotClaim(room.id)}
                    disabled={!isClaimedByUser && openSlots === 0}
                  >
                    <Text
                      style={[
                        styles.actionBtnText,
                        isClaimedByUser && styles.actionBtnTextRelease,
                      ]}
                    >
                      {isClaimedByUser
                        ? 'Release My Slot'
                        : openSlots === 0
                        ? 'Lobby Full'
                        : 'Claim Scrim Slot'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Event Details Modal */}
      <Modal
        visible={!!selectedEvent}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEvent(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedEvent && (
            <View style={styles.modalCard}>
              <View style={styles.modalTop}>
                <Text style={styles.modalBadge}>{selectedEvent.type}</Text>
                <TouchableOpacity onPress={() => setSelectedEvent(null)}>
                  <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalMeta}>
                {selectedEvent.date} at {selectedEvent.time}
              </Text>
              <Text style={styles.modalMeta}>Maps: {selectedEvent.maps}</Text>
              <Text style={styles.modalDesc}>{selectedEvent.details}</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  backBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  backText: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  screenTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    gap: 10,
  },
  tabBtn: {
    flex: 1,
    backgroundColor: '#161616',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  tabBtnActive: {
    backgroundColor: '#f5b800',
    borderColor: '#f5b800',
  },
  tabText: {
    color: '#cccccc',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#0d0d0d',
    fontWeight: '900',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  infoBanner: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 6,
    padding: 10,
  },
  infoBannerText: {
    color: '#cccccc',
    fontSize: 12,
    fontWeight: '600',
  },
  highlight: {
    color: '#f5b800',
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: '#242424',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  mapsText: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  slotCounter: {
    color: '#e5e5e5',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  claimedList: {
    color: '#999999',
    fontSize: 12,
  },
  tapText: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  actionBtn: {
    marginTop: 8,
    backgroundColor: '#f5b800',
    paddingVertical: 11,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionBtnRelease: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#f5b800',
  },
  actionBtnText: {
    color: '#0d0d0d',
    fontSize: 13,
    fontWeight: '800',
  },
  actionBtnTextRelease: {
    color: '#f5b800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#2e2e2e',
    gap: 10,
  },
  modalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBadge: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '800',
  },
  closeX: {
    color: '#d4d4d4',
    fontSize: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  modalMeta: {
    color: '#d4d4d4',
    fontSize: 13,
  },
  modalDesc: {
    color: '#b3b3b3',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
});

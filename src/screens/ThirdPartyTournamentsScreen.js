import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { BGMI_THIRD_PARTY_TOURNAMENTS } from '../data/bgmiThirdPartyTournaments';

const FILTERS = ['ALL', 'OPEN', 'UPCOMING', 'CLOSED'];

export default function ThirdPartyTournamentsScreen({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [remindedIds, setRemindedIds] = useState({});

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'ALL') return BGMI_THIRD_PARTY_TOURNAMENTS;
    return BGMI_THIRD_PARTY_TOURNAMENTS.filter(
      (ev) => ev.status === activeFilter
    );
  }, [activeFilter]);

  const toggleReminder = (id) => {
    setRemindedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← MENU</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>3RD PARTY TOURNAMENTS</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Event Cards */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredEvents.map((ev) => {
          const isReminded = !!remindedIds[ev.id];
          return (
            <TouchableOpacity
              key={ev.id}
              style={styles.card}
              onPress={() => setSelectedEvent(ev)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{ev.name}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{ev.status}</Text>
                </View>
              </View>

              <Text style={styles.organizerText}>Organizer: {ev.organizer}</Text>
              <Text style={styles.dateText}>Dates: {ev.dates}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.prizeText}>Prize: {ev.prizePool}</Text>
                <Text style={styles.hintText}>
                  {isReminded ? '✓ Reminder Set' : 'View Details →'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
                <Text style={styles.modalBadge}>{selectedEvent.registration}</Text>
                <TouchableOpacity onPress={() => setSelectedEvent(null)}>
                  <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>{selectedEvent.name}</Text>
              <Text style={styles.modalSub}>By {selectedEvent.organizer}</Text>

              <View style={styles.infoBox}>
                <Text style={styles.infoRow}>Dates: {selectedEvent.dates}</Text>
                <Text style={styles.infoRow}>Format: {selectedEvent.format}</Text>
                <Text style={styles.infoRow}>Prize Pool: {selectedEvent.prizePool}</Text>
              </View>

              <Text style={styles.summaryText}>{selectedEvent.summary}</Text>

              <TouchableOpacity
                style={[
                  styles.remindBtn,
                  remindedIds[selectedEvent.id] && styles.remindBtnActive,
                ]}
                onPress={() => toggleReminder(selectedEvent.id)}
              >
                <Text
                  style={[
                    styles.remindBtnText,
                    remindedIds[selectedEvent.id] && styles.remindBtnTextActive,
                  ]}
                >
                  {remindedIds[selectedEvent.id]
                    ? 'Reminder Enabled'
                    : 'Remind Me About This Event'}
                </Text>
              </TouchableOpacity>
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
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  chipActive: {
    backgroundColor: '#f5b800',
    borderColor: '#f5b800',
  },
  chipText: {
    color: '#cccccc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  chipTextActive: {
    color: '#0d0d0d',
    fontWeight: '900',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
    gap: 14,
    paddingBottom: 28,
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
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#242424',
    borderWidth: 1,
    borderColor: '#f5b800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  statusText: {
    color: '#f5b800',
    fontSize: 10,
    fontWeight: '800',
  },
  organizerText: {
    color: '#b3b3b3',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    color: '#e5e5e5',
    fontSize: 13,
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#242424',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeText: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '700',
  },
  hintText: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '800',
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
  modalSub: {
    color: '#a3a3a3',
    fontSize: 13,
  },
  infoBox: {
    backgroundColor: '#0d0d0d',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 5,
    marginTop: 4,
  },
  infoRow: {
    color: '#e5e5e5',
    fontSize: 13,
  },
  summaryText: {
    color: '#cccccc',
    fontSize: 13,
    lineHeight: 19,
  },
  remindBtn: {
    marginTop: 8,
    backgroundColor: '#f5b800',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  remindBtnActive: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#f5b800',
  },
  remindBtnText: {
    color: '#0d0d0d',
    fontSize: 15,
    fontWeight: '800',
  },
  remindBtnTextActive: {
    color: '#f5b800',
  },
});

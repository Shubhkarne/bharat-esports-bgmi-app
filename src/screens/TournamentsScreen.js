import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { BGMI_TOURNAMENTS } from '../data/bgmiTournaments';

const FILTERS = ['ALL', 'OPEN', 'INVITE', 'OPEN + INVITE'];

export default function TournamentsScreen({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [remindedIds, setRemindedIds] = useState({});

  const filteredTournaments = useMemo(() => {
    if (activeFilter === 'ALL') return BGMI_TOURNAMENTS;
    if (activeFilter === 'INVITE') {
      return BGMI_TOURNAMENTS.filter((t) =>
        t.entryType.toUpperCase().startsWith('INVITE')
      );
    }
    return BGMI_TOURNAMENTS.filter(
      (t) => t.entryType.toUpperCase() === activeFilter
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
        <Text style={styles.screenTitle}>BGMI TOURNAMENTS</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => {
          const isSelected = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Tournaments List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {filteredTournaments.map((item) => {
          const isReminded = !!remindedIds[item.id];
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedTournament(item)}
              style={styles.card}
              activeOpacity={0.85}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.entryType}</Text>
                </View>
              </View>

              <Text style={styles.cardFullName}>{item.fullName}</Text>
              <Text style={styles.cardDates}>Dates: {item.dates}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.cardMeta}>Prize: {item.prizePool}</Text>
                <Text style={styles.tapHint}>
                  {isReminded ? '✓ Reminder Set' : 'View Details →'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Tournament Details Modal */}
      <Modal
        visible={!!selectedTournament}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTournament(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedTournament && (
            <View style={styles.modalCard}>
              <View style={styles.modalTop}>
                <Text style={styles.modalBadge}>{selectedTournament.entryType}</Text>
                <TouchableOpacity onPress={() => setSelectedTournament(null)}>
                  <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>{selectedTournament.name}</Text>
              <Text style={styles.modalSubtitle}>{selectedTournament.fullName}</Text>

              <View style={styles.infoBox}>
                <Text style={styles.infoRow}>Dates: {selectedTournament.dates}</Text>
                <Text style={styles.infoRow}>Venue / Stage: {selectedTournament.venue}</Text>
                <Text style={styles.infoRow}>Format / Teams: {selectedTournament.teamsCount}</Text>
                <Text style={styles.infoRow}>Prize Pool: {selectedTournament.prizePool}</Text>
              </View>

              <Text style={styles.modalSummary}>{selectedTournament.summary}</Text>

              <TouchableOpacity
                style={[
                  styles.remindBtn,
                  remindedIds[selectedTournament.id] && styles.remindBtnActive,
                ]}
                onPress={() => toggleReminder(selectedTournament.id)}
              >
                <Text
                  style={[
                    styles.remindBtnText,
                    remindedIds[selectedTournament.id] && styles.remindBtnTextActive,
                  ]}
                >
                  {remindedIds[selectedTournament.id]
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
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  filterChipActive: {
    backgroundColor: '#f5b800',
    borderColor: '#f5b800',
  },
  filterText: {
    color: '#cccccc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  filterTextActive: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  typeBadge: {
    backgroundColor: '#242424',
    borderWidth: 1,
    borderColor: '#f5b800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  typeBadgeText: {
    color: '#f5b800',
    fontSize: 11,
    fontWeight: '800',
  },
  cardFullName: {
    color: '#b3b3b3',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDates: {
    color: '#e5e5e5',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
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
  cardMeta: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '700',
  },
  tapHint: {
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
    letterSpacing: 1,
  },
  closeX: {
    color: '#d4d4d4',
    fontSize: 20,
    paddingHorizontal: 4,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  modalSubtitle: {
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
  modalSummary: {
    color: '#cccccc',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
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

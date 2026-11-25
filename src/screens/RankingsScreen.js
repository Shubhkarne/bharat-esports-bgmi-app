import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { BGMI_RANKINGS, POINT_DECAY_INFO } from '../data/bgmiRankings';

export default function RankingsScreen({ onBack }) {
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← MENU</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>BGMI RANKINGS</Text>
        <View style={{ width: 64 }} />
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {/* Point Decay Banner */}
        <View style={styles.decayCard}>
          <Text style={styles.decayTitle}>{POINT_DECAY_INFO.title}</Text>
          <Text style={styles.decayText}>{POINT_DECAY_INFO.summary}</Text>
        </View>

        {/* Leaderboard Rows */}
        {BGMI_RANKINGS.map((team) => (
          <TouchableOpacity
            key={team.id}
            style={styles.rowCard}
            onPress={() => setSelectedTeam(team)}
            activeOpacity={0.85}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>#{team.rank}</Text>
            </View>

            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>
                {team.teamName} <Text style={styles.teamTag}>[{team.tag}]</Text>
              </Text>
              <Text style={styles.teamStats}>
                WWCD: {team.wwcd}  •  Finishes: {team.finishes}
              </Text>
            </View>

            <View style={styles.pointsBox}>
              <Text style={styles.pointsValue}>{team.points}</Text>
              <Text style={styles.pointsLabel}>PTS</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Team Breakdown Modal */}
      <Modal
        visible={!!selectedTeam}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTeam(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedTeam && (
            <View style={styles.modalCard}>
              <View style={styles.modalTop}>
                <Text style={styles.modalTag}>RANK #{selectedTeam.rank} • SEASON {selectedTeam.season}</Text>
                <TouchableOpacity onPress={() => setSelectedTeam(null)}>
                  <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>
                {selectedTeam.teamName} [{selectedTeam.tag}]
              </Text>

              <View style={styles.statsBox}>
                <Text style={styles.statLine}>Total Ranking Points: {selectedTeam.points}</Text>
                <Text style={styles.statLine}>Chicken Dinners (WWCD): {selectedTeam.wwcd}</Text>
                <Text style={styles.statLine}>Total Finishes: {selectedTeam.finishes}</Text>
              </View>

              <Text style={styles.decayNote}>{selectedTeam.decayNote}</Text>
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
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  decayCard: {
    backgroundColor: '#161616',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    gap: 4,
    marginBottom: 4,
  },
  decayTitle: {
    color: '#f5b800',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  decayText: {
    color: '#cccccc',
    fontSize: 12,
    lineHeight: 18,
  },
  rowCard: {
    backgroundColor: '#161616',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#262626',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 42,
    height: 42,
    borderRadius: 4,
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#f5b800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    color: '#f5b800',
    fontSize: 14,
    fontWeight: '900',
  },
  teamInfo: {
    flex: 1,
    gap: 3,
  },
  teamName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  teamTag: {
    color: '#a3a3a3',
    fontSize: 12,
    fontWeight: '700',
  },
  teamStats: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  pointsBox: {
    alignItems: 'flex-end',
  },
  pointsValue: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  pointsLabel: {
    color: '#f5b800',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
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
  modalTag: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  closeX: {
    color: '#d4d4d4',
    fontSize: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '900',
  },
  statsBox: {
    backgroundColor: '#0d0d0d',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 6,
  },
  statLine: {
    color: '#e5e5e5',
    fontSize: 13,
  },
  decayNote: {
    color: '#b3b3b3',
    fontSize: 13,
    lineHeight: 18,
  },
});

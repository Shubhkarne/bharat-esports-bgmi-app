import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { INITIAL_BGMI_SQUADS } from '../data/bgmiSquads';

export default function SquadRosterScreen({ onBack, currentUser }) {
  const [squads, setSquads] = useState(INITIAL_BGMI_SQUADS);
  const [selectedSquadId, setSelectedSquadId] = useState(INITIAL_BGMI_SQUADS[0].id);
  const [isEditingMySquad, setIsEditingMySquad] = useState(false);

  const defaultIgn = currentUser?.ign || 'BGMI_Player';
  const [customSquadName, setCustomSquadName] = useState('MY BGMI SQUAD');
  const [customTag, setCustomTag] = useState('MBS');
  const [p1, setP1] = useState(defaultIgn);
  const [p2, setP2] = useState('Player_2');
  const [p3, setP3] = useState('Player_3');
  const [p4, setP4] = useState('Player_4');

  const activeSquad =
    squads.find((s) => s.id === selectedSquadId) || squads[0];

  const handleSaveMySquad = () => {
    const cleanTag = (customTag.trim() || 'SQD').toUpperCase();
    const cleanName = (customSquadName.trim() || 'MY BGMI SQUAD').toUpperCase();
    const customEntry = {
      id: 'squad-custom',
      squadName: cleanName,
      tag: cleanTag,
      region: 'India',
      roster: [
        { slot: 1, ign: p1.trim() || defaultIgn, role: 'IGL' },
        { slot: 2, ign: p2.trim() || 'Player_2', role: 'Assaulter' },
        { slot: 3, ign: p3.trim() || 'Player_3', role: 'Entry Fragger' },
        { slot: 4, ign: p4.trim() || 'Player_4', role: 'Support' },
      ],
    };

    setSquads((prev) => {
      const withoutCustom = prev.filter((item) => item.id !== 'squad-custom');
      return [customEntry, ...withoutCustom];
    });
    setSelectedSquadId('squad-custom');
    setIsEditingMySquad(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← MENU</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>SQUAD ROSTER</Text>
        <TouchableOpacity
          onPress={() => setIsEditingMySquad((prev) => !prev)}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>
            {isEditingMySquad ? 'CANCEL' : '+ MY SQUAD'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {/* Squad Selector Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {squads.map((sq) => {
            const active = sq.id === activeSquad.id && !isEditingMySquad;
            return (
              <TouchableOpacity
                key={sq.id}
                onPress={() => {
                  setIsEditingMySquad(false);
                  setSelectedSquadId(sq.id);
                }}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {sq.squadName} [{sq.tag}]
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isEditingMySquad ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create / Update BGMI Squad (4 Players)</Text>

            <TextInput
              style={styles.input}
              placeholder="Squad Name"
              placeholderTextColor="#777"
              value={customSquadName}
              onChangeText={setCustomSquadName}
            />
            <TextInput
              style={styles.input}
              placeholder="Squad Tag (e.g. BHR)"
              placeholderTextColor="#777"
              value={customTag}
              onChangeText={setCustomTag}
              maxLength={5}
            />
            <TextInput
              style={styles.input}
              placeholder="Slot 1 IGN (IGL)"
              placeholderTextColor="#777"
              value={p1}
              onChangeText={setP1}
            />
            <TextInput
              style={styles.input}
              placeholder="Slot 2 IGN (Assaulter)"
              placeholderTextColor="#777"
              value={p2}
              onChangeText={setP2}
            />
            <TextInput
              style={styles.input}
              placeholder="Slot 3 IGN (Entry Fragger)"
              placeholderTextColor="#777"
              value={p3}
              onChangeText={setP3}
            />
            <TextInput
              style={styles.input}
              placeholder="Slot 4 IGN (Support)"
              placeholderTextColor="#777"
              value={p4}
              onChangeText={setP4}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveMySquad}>
              <Text style={styles.saveBtnText}>Save Squad Roster</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.rosterCard}>
            <View style={styles.rosterHeader}>
              <Text style={styles.squadTitle}>
                {activeSquad.squadName} [{activeSquad.tag}]
              </Text>
              <Text style={styles.regionText}>{activeSquad.region}</Text>
            </View>

            {activeSquad.roster.map((member) => (
              <View key={member.slot} style={styles.memberRow}>
                <View style={styles.slotPill}>
                  <Text style={styles.slotText}>P{member.slot}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.ignText}>{member.ign}</Text>
                  <Text style={styles.roleText}>{member.role}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  editText: {
    color: '#f5b800',
    fontSize: 11,
    fontWeight: '800',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 28,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
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
  },
  chipTextActive: {
    color: '#0d0d0d',
    fontWeight: '900',
  },
  rosterCard: {
    backgroundColor: '#161616',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 12,
  },
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  squadTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  regionText: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '800',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222222',
    gap: 12,
  },
  slotPill: {
    backgroundColor: '#242424',
    borderWidth: 1,
    borderColor: '#f5b800',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  slotText: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '900',
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  ignText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  roleText: {
    color: '#a3a3a3',
    fontSize: 12,
  },
  formCard: {
    backgroundColor: '#161616',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#262626',
    gap: 10,
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
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
  saveBtn: {
    marginTop: 6,
    backgroundColor: '#f5b800',
    paddingVertical: 13,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#0d0d0d',
    fontSize: 14,
    fontWeight: '900',
  },
});

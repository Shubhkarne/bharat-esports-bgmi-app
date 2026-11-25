import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { BGMI_VIDEOS } from '../data/bgmiVideos';

const CATEGORIES = ['ALL', 'HIGHLIGHTS', 'TRAILERS', 'RECAPS'];

export default function VideosScreen({ onBack }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [savedIds, setSavedIds] = useState({});

  const visibleVideos = useMemo(() => {
    if (activeCategory === 'ALL') return BGMI_VIDEOS;
    return BGMI_VIDEOS.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  const toggleWatchlist = (id) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← MENU</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>BGMI VIDEOS</Text>
        <View style={{ width: 64 }} />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Video Cards */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {visibleVideos.map((vid) => {
          const isSaved = !!savedIds[vid.id];
          return (
            <TouchableOpacity
              key={vid.id}
              style={styles.card}
              onPress={() => setSelectedVideo(vid)}
              activeOpacity={0.85}
            >
              <View style={styles.thumbnailBox}>
                <Text style={styles.playIcon}>▶</Text>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{vid.duration}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.metaRow}>
                  <Text style={styles.catLabel}>{vid.category}</Text>
                  <Text style={styles.metaText}>
                    {vid.views} • {vid.publishedAt}
                  </Text>
                </View>

                <Text style={styles.videoTitle}>{vid.title}</Text>
                <Text style={styles.watchLaterHint}>
                  {isSaved ? '✓ Saved to Watchlist' : 'Tap for details →'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Video Details Modal */}
      <Modal
        visible={!!selectedVideo}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedVideo(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedVideo && (
            <View style={styles.modalCard}>
              <View style={styles.modalTop}>
                <Text style={styles.modalCat}>
                  {selectedVideo.category} • {selectedVideo.duration}
                </Text>
                <TouchableOpacity onPress={() => setSelectedVideo(null)}>
                  <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalTitle}>{selectedVideo.title}</Text>
              <Text style={styles.modalMeta}>
                {selectedVideo.views} • Released {selectedVideo.publishedAt}
              </Text>
              <Text style={styles.modalDesc}>{selectedVideo.summary}</Text>

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  savedIds[selectedVideo.id] && styles.saveBtnActive,
                ]}
                onPress={() => toggleWatchlist(selectedVideo.id)}
              >
                <Text
                  style={[
                    styles.saveBtnText,
                    savedIds[selectedVideo.id] && styles.saveBtnTextActive,
                  ]}
                >
                  {savedIds[selectedVideo.id]
                    ? 'Saved in Watchlist'
                    : 'Save to Watchlist'}
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262626',
  },
  thumbnailBox: {
    height: 140,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playIcon: {
    color: '#f5b800',
    fontSize: 32,
  },
  durationBadge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.82)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 3,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLabel: {
    color: '#f5b800',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  metaText: {
    color: '#999999',
    fontSize: 11,
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  watchLaterHint: {
    color: '#f5b800',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
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
  modalCat: {
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
    color: '#a3a3a3',
    fontSize: 12,
  },
  modalDesc: {
    color: '#d4d4d4',
    fontSize: 13,
    lineHeight: 19,
  },
  saveBtn: {
    marginTop: 8,
    backgroundColor: '#f5b800',
    paddingVertical: 13,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveBtnActive: {
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#f5b800',
  },
  saveBtnText: {
    color: '#0d0d0d',
    fontSize: 14,
    fontWeight: '800',
  },
  saveBtnTextActive: {
    color: '#f5b800',
  },
});

function CategoryIcon({ category, size = 24 }) {
  // Normalize category name (case-insensitive, trim whitespace)
  const normalizedCategory = category?.toLowerCase().trim() || '';

  // Category to emoji mapping
  const getEmoji = (cat) => {
    // Weapon/Sword variations
    if (cat.includes('weapon') || cat.includes('sword')) {
      return '🗡️';
    }

    // Money/Currency variations
    if (cat.includes('money') || cat.includes('currency') || cat.includes('coin') || cat.includes('emerald')) {
      return '💰';
    }

    // Armor variations
    if (cat.includes('armor') || cat.includes('armour') || cat.includes('shield') || cat.includes('chestplate')) {
      return '🛡️';
    }

    // Trident variations
    if (cat.includes('trident')) {
      return '🔱';
    }

    // Tools variations
    if (cat.includes('tool') || cat.includes('pickaxe') || cat.includes('axe') || cat.includes('shovel') || cat.includes('hoe')) {
      return '⛏️'; // Pickaxe emoji
    }

    // Blocks variations
    if (cat.includes('block') || cat.includes('building') || cat.includes('material')) {
      return '🧱';
    }

    // Spawner variations
    if (cat.includes('spawner') || cat.includes('mob')) {
      return '🧊';
    }

    // Default placeholder
    return '📦';
  };

  const emoji = getEmoji(normalizedCategory);

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      lineHeight: 0,
      fontSize: `${size}px`
    }}>
      {emoji}
    </span>
  );
}

export default CategoryIcon;


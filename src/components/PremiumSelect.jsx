import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  Check,
  Palette,
  Code,
  Rocket,
  Heart,
  Star,
  Flame,
  Crown,
  Gem,
  Zap,
  Music,
  Camera,
  Gamepad,
  Coffee,
  Plane,
  Shield,
} from "lucide-react";

const iconMap = {
  palette: Palette,
  code: Code,
  rocket: Rocket,
  heart: Heart,
  star: Star,
  flame: Flame,
  crown: Crown,
  gem: Gem,
  zap: Zap,
  music: Music,
  camera: Camera,
  gamepad: Gamepad,
  coffee: Coffee,
  plane: Plane,
  shield: Shield,
};

const PremiumSelect = ({
  options,
  placeholder = "Choose Your Favorite...",
  onSelect,
  defaultIcon = "palette",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    setSearchTerm("");
    if (onSelect) onSelect(option);
  };

  const DefaultIcon = iconMap[defaultIcon] || Palette;
  const SelectedIcon = selected ? iconMap[selected.icon] : DefaultIcon;

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ y: -2 }}
        className={`
          relative overflow-hidden cursor-pointer
          bg-white/10 backdrop-blur-xl
          border-2 transition-all duration-300
          rounded-2xl px-6 py-4
          flex items-center justify-between
          ${isOpen
            ? "border-white/50 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]"
            : "border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
          }
        `}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <SelectedIcon
              className="w-6 h-6 text-white"
              style={{ color: selected?.color }}
            />
          </motion.div>
          <span className="text-white font-medium text-[15px]">
            {selected ? selected.label : placeholder}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="absolute top-full left-0 right-0 mt-4 z-50
              bg-[#1e1e32]/95 backdrop-blur-xl
              border-2 border-white/20 rounded-2xl
              shadow-2xl overflow-hidden
              max-h-[450px] flex flex-col"
          >
            {/* Search Box */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full px-5 py-3 pr-12
                    bg-white/10 border-2 border-white/20
                    rounded-xl text-white placeholder-white/50
                    focus:border-white/40 focus:bg-white/15
                    focus:outline-none focus:shadow-lg
                    transition-all duration-300"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              </div>
            </div>

            {/* Options Container */}
            <div className="overflow-y-auto overflow-x-hidden max-h-[320px] p-2 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const Icon = iconMap[option.icon] || Code;
                  const isSelected = selected?.value === option.value;

                  return (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelect(option)}
                      className={`
                        relative overflow-hidden cursor-pointer
                        px-5 py-4 rounded-xl mb-2
                        flex items-center justify-between gap-4
                        transition-all duration-300
                        ${isSelected
                          ? "bg-gradient-to-r from-accent/30 to-purple-500/30 border border-white/20"
                          : "hover:bg-white/10 hover:translate-x-2"
                        }
                      `}
                    >
                      {/* Ripple background */}
                      <div className="absolute inset-0 bg-white/10 rounded-full scale-0 group-hover:scale-[3] transition-transform duration-600 opacity-0 group-hover:opacity-100" />

                      <div className="flex items-center gap-4 relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: option.color }}
                          />
                        </motion.div>
                        <span className="text-white/90 font-medium">
                          {option.label}
                        </span>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Check className="w-5 h-5 text-green-400" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-white/50"
                >
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No results found!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00c853, #667eea);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #667eea, #00c853);
        }
      `}</style>
    </div>
  );
};

export default PremiumSelect;

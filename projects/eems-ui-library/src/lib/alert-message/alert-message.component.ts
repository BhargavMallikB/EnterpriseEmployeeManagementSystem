import { Component, Output, EventEmitter, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faCheckCircle, 
  faTimesCircle, 
  faExclamationTriangle, 
  faInfoCircle,
  faSignOutAlt,
  faUser,
  faCog,
  faHome,
  faSearch,
  faEdit,
  faTrash,
  faSave,
  faPlus,
  faMinus,
  faEye,
  faEyeSlash,
  faLock,
  faUnlock,
  faDownload,
  faUpload,
  faPrint,
  faShare,
  faHeart,
  faStar,
  faBell,
  faEnvelope,
  faPhone,
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faLink,
  faExternalLinkAlt,
  faCopy,
  faCut,
  faPaste,
  faUndo,
  faRedo,
  faFilter,
  faSort,
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faCheck,
  faTimes,
  faQuestion,
  faExclamation,
  faLightbulb,
  faRocket,
  faGift,
  faTrophy,
  faMedal,
  faCertificate,
  faGraduationCap,
  faBriefcase,
  faShoppingCart,
  faCreditCard,
  faWallet,
  faChartBar,
  faChartLine,
  faChartPie,
  faTable,
  faList,
  faThumbsUp,
  faThumbsDown,
  faSmile,
  faFrown,
  faMeh,
  faLaugh,
  faAngry,
  faSurprise,
  faKiss,
  faGrin,
  faGrinBeam,
  faGrinHearts,
  faGrinStars,
  faGrinTears,
  faGrinTongue,
  faGrinTongueWink,
  faGrinTongueSquint,
  faGrinWink,
  faGrinSquint,
  faGrinSquintTears
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'lib-alert-message',
  imports: [CommonModule, FontAwesomeModule, ButtonComponent],
  templateUrl: './alert-message.component.html',
  styleUrl: './alert-message.component.scss'
})
export class AlertMessageComponent {
  // Convert inputs to signals
  message = input<string>('');
  type = input<'success' | 'error' | 'warning' | 'info'>('info');
  show = input<boolean>(true);
  dismissible = input<boolean>(true);
  isToast = input<boolean>(false);
  position = input<'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left'>('top-center');
  
  // Icon-related inputs
  customIcon = input<IconDefinition | null>(null);
  iconName = input<string>(''); // New: string-based icon selection
  showIcon = input<boolean>(true);
  iconPosition = input<'prefix' | 'suffix'>('prefix');
  
  // Action button support
  actionButtonText = input<string>('');
  actionButtonVariant = input<'primary' | 'secondary' | 'success' | 'danger' | 'plain' | 'custom'>('primary');
  actionButtonSize = input<'small' | 'medium' | 'large'>('small');
  
  // Custom content support
  showCustomContent = input<boolean>(false);

  @Output() dismiss = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  // Internal state for showing/hiding the alert
  private internalShow = signal(true);

  // FontAwesome icons
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faExclamationTriangle = faExclamationTriangle;
  faInfoCircle = faInfoCircle;

  // Comprehensive icon mapping
  private iconMap: { [key: string]: IconDefinition } = {
    // Default type icons
    'success': faCheckCircle,
    'error': faTimesCircle,
    'warning': faExclamationTriangle,
    'info': faInfoCircle,
    
    // User and authentication
    'signout': faSignOutAlt,
    'signin': faUser,
    'user': faUser,
    'profile': faUser,
    'account': faUser,
    'login': faUser,
    'logout': faSignOutAlt,
    'lock': faLock,
    'unlock': faUnlock,
    
    // Navigation
    'home': faHome,
    'settings': faCog,
    'config': faCog,
    'gear': faCog,
    'menu': faCog,
    
    // Actions
    'search': faSearch,
    'edit': faEdit,
    'delete': faTrash,
    'remove': faTrash,
    'save': faSave,
    'add': faPlus,
    'create': faPlus,
    'new': faPlus,
    'minus': faMinus,
    'subtract': faMinus,
    'view': faEye,
    'hide': faEyeSlash,
    'show': faEye,
    'download': faDownload,
    'upload': faUpload,
    'print': faPrint,
    'share': faShare,
    
    // Feedback
    'love': faHeart,
    'favorite': faHeart,
    'star': faStar,
    'rating': faStar,
    'notification': faBell,
    'alert': faBell,
    'message': faEnvelope,
    'email': faEnvelope,
    'mail': faEnvelope,
    'phone': faPhone,
    'call': faPhone,
    'telephone': faPhone,
    
    // Time and date
    'calendar': faCalendar,
    'date': faCalendar,
    'time': faClock,
    'clock': faClock,
    'schedule': faClock,
    
    // Location
    'location': faMapMarkerAlt,
    'map': faMapMarkerAlt,
    'address': faMapMarkerAlt,
    'place': faMapMarkerAlt,
    
    // Links and navigation
    'link': faLink,
    'url': faLink,
    'external': faExternalLinkAlt,
    'open': faExternalLinkAlt,
    'copy': faCopy,
    'duplicate': faCopy,
    'cut': faCut,
    'paste': faPaste,
    'undo': faUndo,
    'redo': faRedo,
    
    // Data and filtering
    'filter': faFilter,
    'sort': faSort,
    'sortup': faSortUp,
    'sortdown': faSortDown,
    'ascending': faSortUp,
    'descending': faSortDown,
    
    // Arrows and navigation
    'left': faChevronLeft,
    'right': faChevronRight,
    'up': faChevronUp,
    'down': faChevronDown,
    'previous': faChevronLeft,
    'next': faChevronRight,
    'back': faArrowLeft,
    'forward': faArrowRight,
    'arrowleft': faArrowLeft,
    'arrowright': faArrowRight,
    'arrowup': faArrowUp,
    'arrowdown': faArrowDown,
    
    // Status and feedback
    'check': faCheck,
    'ok': faCheck,
    'yes': faCheck,
    'close': faTimes,
    'cancel': faTimes,
    'no': faTimes,
    'question': faQuestion,
    'help': faQuestion,
    'exclamation': faExclamation,
    'important': faExclamation,
    
    // Achievement and success
    'lightbulb': faLightbulb,
    'idea': faLightbulb,
    'rocket': faRocket,
    'launch': faRocket,
    'gift': faGift,
    'present': faGift,
    'trophy': faTrophy,
    'winner': faTrophy,
    'medal': faMedal,
    'certificate': faCertificate,
    'diploma': faGraduationCap,
    'education': faGraduationCap,
    'work': faBriefcase,
    'job': faBriefcase,
    'career': faBriefcase,
    
    // Commerce
    'cart': faShoppingCart,
    'shopping': faShoppingCart,
    'buy': faShoppingCart,
    'purchase': faShoppingCart,
    'creditcard': faCreditCard,
    'card': faCreditCard,
    'payment': faCreditCard,
    'wallet': faWallet,
    'money': faWallet,
    
    // Data visualization
    'chart': faChartBar,
    'chartbar': faChartBar,
    'barchart': faChartBar,
    'chartline': faChartLine,
    'linechart': faChartLine,
    'chartpie': faChartPie,
    'piechart': faChartPie,
    'table': faTable,
    'list': faList,
    
    // Feedback and reactions
    'thumbsup': faThumbsUp,
    'thumbsdown': faThumbsDown,
    'dislike': faThumbsDown,
    
    // Emotions and expressions
    'smile': faSmile,
    'happy': faSmile,
    'frown': faFrown,
    'sad': faFrown,
    'meh': faMeh,
    'neutral': faMeh,
    'laugh': faLaugh,
    'angry': faAngry,
    'surprise': faSurprise,
    'kiss': faKiss,
    'grin': faGrin,
    'grinbeam': faGrinBeam,
    'grinhearts': faGrinHearts,
    'grinstars': faGrinStars,
    'grintears': faGrinTears,
    'grintongue': faGrinTongue,
    'grintonguewink': faGrinTongueWink,
    'grintonguesquint': faGrinTongueSquint,
    'grinwink': faGrinWink,
    'grinsquint': faGrinSquint,
    'grinsquinttears': faGrinSquintTears
  };

  // Computed signal for icon
  icon = computed(() => {
    // If custom icon is provided, use it
    if (this.customIcon()) {
      return this.customIcon();
    }
    
    // If iconName is provided, try to map it
    if (this.iconName()) {
      const iconKey = this.iconName().toLowerCase().trim();
      if (this.iconMap[iconKey]) {
        return this.iconMap[iconKey];
      }
    }
    
    // Otherwise use default icons based on type
    switch (this.type()) {
      case 'success': return this.faCheckCircle;
      case 'error': return this.faTimesCircle;
      case 'warning': return this.faExclamationTriangle;
      case 'info': return this.faInfoCircle;
      default: return this.faInfoCircle;
    }
  });

  // Computed signal to determine if icon should be shown
  shouldShowIcon = computed(() => {
    return this.showIcon() && this.icon() !== null;
  });

  // Computed signal to determine if alert should be visible
  shouldShow = computed(() => {
    return this.show() && this.internalShow();
  });

  // Method to get available icon names (for documentation/help)
  getAvailableIconNames(): string[] {
    return Object.keys(this.iconMap);
  }

  // Method to check if an icon name is valid
  isValidIconName(iconName: string): boolean {
    return this.iconMap[iconName.toLowerCase().trim()] !== undefined;
  }

  onDismiss() {
    // Hide the alert internally
    this.internalShow.set(false);
    // Emit the dismiss event for parent components
    this.dismiss.emit();
  }

  onActionClick() {
    this.actionClick.emit();
  }
}

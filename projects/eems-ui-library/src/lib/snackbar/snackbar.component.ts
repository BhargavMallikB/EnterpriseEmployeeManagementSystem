import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
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
// import { ButtonComponent } from '../../button/button.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'lib-snackbar',
  imports: [FontAwesomeModule, ButtonComponent, CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent implements OnInit, OnDestroy {
  // Convert inputs to signals
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() show: boolean = true;
  @Input() dismissible: boolean = true;
  @Input() position: 'center'|'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left' = 'top-right';

  // Auto-dismiss functionality
  @Input() autoDismiss: boolean = true;
  @Input() autoDismissDelay: number = 5000; // 5 seconds default

  // Icon-related inputs
  @Input() customIcon: IconDefinition | null = null;
  @Input() iconName: string = '';
  @Input() showIcon: boolean = true;
  @Input() iconPosition: 'prefix' | 'suffix' = 'prefix';

  // Action button support
  @Input() actionButtonText: string = '';
  @Input() actionButtonVariant: 'primary' | 'secondary' | 'success' | 'danger' | 'plain' | 'custom' = 'primary';
  @Input() actionButtonSize: 'small' | 'medium' | 'large' = 'small';

  // Custom content support
  @Input() showCustomContent: boolean = false;

  @Output() dismiss = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  // Internal state for showing/hiding the snackbar
  private internalShow = true;
  private autoDismissTimer: any = null;

  // FontAwesome icons
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faExclamationTriangle = faExclamationTriangle;
  faInfoCircle = faInfoCircle;

  // Comprehensive icon mapping (same as alert-message)
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

  get icon() {
    if (this.customIcon) {
      return this.customIcon;
    }
    if (this.iconName) {
      const iconKey = this.iconName.toLowerCase().trim();
      if (this.iconMap[iconKey]) {
        return this.iconMap[iconKey];
      }
    }
    switch (this.type) {
      case 'success': return this.faCheckCircle;
      case 'error': return this.faTimesCircle;
      case 'warning': return this.faExclamationTriangle;
      case 'info': return this.faInfoCircle;
      default: return this.faInfoCircle;
    }
  }

  get shouldShowIcon() {
    return this.showIcon && this.icon !== null;
  }

  get shouldShow() {
    return this.show && this.internalShow;
  }

  private setupAutoDismiss() {
    if (this.autoDismiss && this.autoDismissDelay > 0) {
      this.startAutoDismissTimer();
    } else {
      this.clearAutoDismissTimer();
    }
  }

  ngOnInit() {
    this.setupAutoDismiss();
  }

  ngOnChanges() {
    this.setupAutoDismiss();
  }

  ngOnDestroy() {
    // Clear timer when component is destroyed
    this.clearAutoDismissTimer();
  }

  // Method to get available icon names (for documentation/help)
  getAvailableIconNames(): string[] {
    return Object.keys(this.iconMap);
  }

  // Method to check if an icon name is valid
  isValidIconName(iconName: string): boolean {
    return this.iconMap[iconName.toLowerCase().trim()] !== undefined;
  }

  // Get title based on type
  getTitle(): string {
    switch (this.type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return 'Info';
    }
  }

  // Start auto-dismiss timer
  private startAutoDismissTimer() {
    this.clearAutoDismissTimer(); // Clear any existing timer
    this.autoDismissTimer = setTimeout(() => {
      this.onDismiss();
    }, this.autoDismissDelay);
  }

  // Clear auto-dismiss timer
  private clearAutoDismissTimer() {
    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
      this.autoDismissTimer = null;
    }
  }

  // Pause auto-dismiss when user hovers (optional enhancement)
  onMouseEnter() {
    if (this.autoDismiss && this.autoDismissDelay > 0) {
      this.clearAutoDismissTimer();
    }
  }

  // Resume auto-dismiss when user leaves
  onMouseLeave() {
    if (this.autoDismiss && this.autoDismissDelay > 0) {
      this.startAutoDismissTimer();
    }
  }

  onDismiss() {
    // Clear timer
    this.clearAutoDismissTimer();
    // Hide the snackbar internally
    this.internalShow = false;
    // Emit the dismiss event for parent components
    this.dismiss.emit();
  }

  onActionClick() {
    // Clear auto-dismiss timer when action is clicked
    if (this.autoDismiss) {
      this.clearAutoDismissTimer();
    }
    this.actionClick.emit();
  }
}

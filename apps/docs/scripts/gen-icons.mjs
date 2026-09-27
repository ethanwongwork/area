import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(dirname(require.resolve("@fluentui/svg-icons/package.json")), "icons");
const ASSETS = join(ROOT, "assets");

/*
 * Area's own marks, vendored.
 *
 * Twenty-nine glyphs Fluent does not draw, or draws differently: the inspector-panel
 * vocabulary -- gap, padding, flow, corner radius, opacity, aspect ratio, the corner marks.
 * Area authored them on the 16 grid to sit beside the Fluent set, and twenty-eight of
 * them are *stroked* rather than filled, which is the one place Area's "Fluent icons are
 * filled paths, never strokes" rule has to be read as what it actually protects: an icon
 * that has not been fitted to the set's optical weight will not match it. These were
 * fitted, by measurement -- a 1-unit rule, round terminals, and an ink box of 12 units for
 * a rectilinear mark or 14 for a round one, which is where Fluent's own square and round
 * marks land. Their inner markup is taken verbatim, stroke attributes and all, because
 * reducing them to a path list is exactly what would break that fit.
 */
const area = (dir) =>
  Object.fromEntries(
    readdirSync(`${ASSETS}/${dir}`)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => {
        const svg = readFileSync(`${ASSETS}/${dir}/${f}`, "utf8");
        const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>[\s\S]*$/, "").trim();
        return [f.replace(/\.svg$/, ""), inner.replace(/\n\s*/g, "")];
      }),
  );

const AREA = area("area-icons");
const AREA_FILLED = area("area-icons-filled");
// name -> Fluent icon id, or a size-specific cut where a component owns a larger slot.
const MAP = {
  PlusIcon: "add_16_regular",
  BellIcon: "alert_16_regular",
  SearchIcon: "search_16_regular",
  CheckIcon: "checkmark_16_regular",
  InfoIcon: "info_16_regular",
  AlertIcon: "warning_16_regular",
  ArrowIcon: "arrow_right_16_regular",
  ArrowUpIcon: "arrow_up_16_regular",
  ChevronIcon: "chevron_down_16_regular",
  FolderIcon: "folder_16_regular",
  DocumentIcon: "document_16_regular",
  DismissIcon: "dismiss_16_regular",
  TrashIcon: "delete_16_regular",
  LinkIcon: "link_16_regular",
  OpenIcon: "open_16_regular",
  PersonSmallIcon: "person_16_regular",
  PersonIcon: { id: "person_20_regular", size: 20 },
  AlignTopIcon: "align_top_16_regular",
  AlignMiddleIcon: "align_center_vertical_16_regular",
  AlignBottomIcon: "align_bottom_16_regular",
  // Fluent references for the Area icon pilot (docs/specs/icons.md).
  MoreIcon: "more_horizontal_16_regular",
  SettingsIcon: "settings_16_regular",
  FluentEyeIcon: "eye_16_regular",
  AlignLeftIcon: "align_left_16_regular",
  AlignCenterHorizontalIcon: "align_center_horizontal_16_regular",
  AlignRightIcon: "align_right_16_regular",
  SubtractIcon: "subtract_16_regular",
  ThumbLikeIcon: "thumb_like_16_regular",
  ThumbDislikeIcon: "thumb_dislike_16_regular",
  SpeakerIcon: "speaker_2_16_regular",
  RegenerateIcon: "arrow_clockwise_16_regular",
  EditIcon: "edit_16_regular",
  // Fluent references for batches 5–13 (gallery comparison plates).
  FluentRefVolumeIcon: "speaker_2_16_regular",
  FluentRefVolumeFilledIcon: "speaker_2_16_filled",
  FluentRefVolumeOffIcon: "speaker_mute_16_regular",
  FluentRefVolumeOffFilledIcon: "speaker_mute_16_filled",
  FluentRefMusicIcon: "music_note_2_16_regular",
  FluentRefMusicFilledIcon: "music_note_2_16_filled",
  FluentRefFilmIcon: "filmstrip_16_regular",
  FluentRefFilmFilledIcon: "filmstrip_16_filled",
  FluentRefCreditCardIcon: "payment_16_regular",
  FluentRefCreditCardFilledIcon: "payment_16_filled",
  FluentRefWalletIcon: "wallet_16_regular",
  FluentRefWalletFilledIcon: "wallet_16_filled",
  FluentRefReceiptIcon: "receipt_16_regular",
  FluentRefReceiptFilledIcon: "receipt_16_filled",
  FluentRefLightbulbIcon: "lightbulb_16_regular",
  FluentRefLightbulbFilledIcon: "lightbulb_16_filled",
  FluentRefMegaphoneIcon: "megaphone_16_regular",
  FluentRefMegaphoneFilledIcon: "megaphone_16_filled",
  FluentRefPersonAddIcon: "person_add_16_regular",
  FluentRefPersonAddFilledIcon: "person_add_16_filled",
  FluentRefHistoryIcon: "history_16_regular",
  FluentRefHistoryFilledIcon: "history_16_filled",
  FluentRefSaveIcon: "save_16_regular",
  FluentRefSaveFilledIcon: "save_16_filled",
  FluentRefBugIcon: "bug_16_regular",
  FluentRefBugFilledIcon: "bug_16_filled",
  FluentRefEyedropperIcon: "eyedropper_16_regular",
  FluentRefEyedropperFilledIcon: "eyedropper_16_filled",
  FluentRefPaintbrushIcon: "paint_brush_16_regular",
  FluentRefPaintbrushFilledIcon: "paint_brush_16_filled",
  FluentRefPuzzleIcon: "puzzle_piece_16_regular",
  FluentRefPuzzleFilledIcon: "puzzle_piece_16_filled",
  FluentRefRulerIcon: "ruler_16_regular",
  FluentRefRulerFilledIcon: "ruler_16_filled",
  FluentRefBellOffIcon: "alert_off_16_regular",
  FluentRefBellOffFilledIcon: "alert_off_16_filled",
  FluentRefMicOffIcon: "mic_off_16_regular",
  FluentRefMicOffFilledIcon: "mic_off_16_filled",
  FluentRefVideoOffIcon: "video_off_16_regular",
  FluentRefVideoOffFilledIcon: "video_off_16_filled",
  FluentRefCalculatorIcon: "calculator_16_regular",
  FluentRefCalculatorFilledIcon: "calculator_16_filled",
  FluentRefGraduationCapIcon: "hat_graduation_16_regular",
  FluentRefGraduationCapFilledIcon: "hat_graduation_16_filled",
  FluentRefCarIcon: "vehicle_car_16_regular",
  FluentRefCarFilledIcon: "vehicle_car_16_filled",
  FluentRefPackageIcon: "box_16_regular",
  FluentRefPackageFilledIcon: "box_16_filled",
  FluentRefWifiOffIcon: "wifi_off_20_regular",
  FluentRefWifiOffFilledIcon: "wifi_off_20_filled",
  FluentRefLinkOffIcon: "link_dismiss_16_regular",
  FluentRefLinkOffFilledIcon: "link_dismiss_16_filled",
  FluentRefCloudUploadIcon: "cloud_arrow_up_16_regular",
  FluentRefCloudUploadFilledIcon: "cloud_arrow_up_16_filled",
  FluentRefCommandIcon: "key_command_16_regular",
  FluentRefCommandFilledIcon: "key_command_16_filled",
  FluentRefReturnIcon: "arrow_enter_left_20_regular",
  FluentRefReturnFilledIcon: "arrow_enter_left_20_filled",
  FluentRefBackspaceIcon: "backspace_16_regular",
  FluentRefBackspaceFilledIcon: "backspace_16_filled",
  FluentRefRocketIcon: "rocket_16_regular",
  FluentRefRocketFilledIcon: "rocket_16_filled",
  FluentRefSkipForwardIcon: "next_16_regular",
  FluentRefSkipForwardFilledIcon: "next_16_filled",
  FluentRefSkipBackIcon: "previous_16_regular",
  FluentRefSkipBackFilledIcon: "previous_16_filled",
  FluentRefStopIcon: "stop_16_regular",
  FluentRefStopFilledIcon: "stop_16_filled",
  FluentRefRepeatIcon: "arrow_repeat_all_16_regular",
  FluentRefRepeatFilledIcon: "arrow_repeat_all_16_filled",
  FluentRefPersonRemoveIcon: "person_delete_16_regular",
  FluentRefPersonRemoveFilledIcon: "person_delete_16_filled",
  FluentRefClipboardIcon: "clipboard_16_regular",
  FluentRefClipboardFilledIcon: "clipboard_16_filled",
  FluentRefStickyNoteIcon: "note_16_regular",
  FluentRefStickyNoteFilledIcon: "note_16_filled",
  FluentRefTrendingUpIcon: "arrow_trending_16_regular",
  FluentRefTrendingUpFilledIcon: "arrow_trending_16_filled",
  FluentRefShoppingBagIcon: "shopping_bag_16_regular",
  FluentRefShoppingBagFilledIcon: "shopping_bag_16_filled",
  FluentRefCloudDownloadIcon: "cloud_arrow_down_16_regular",
  FluentRefCloudDownloadFilledIcon: "cloud_arrow_down_16_filled",
  FluentRefCalendarAddIcon: "calendar_add_16_regular",
  FluentRefCalendarAddFilledIcon: "calendar_add_16_filled",
  FluentRefFolderAddIcon: "folder_add_16_regular",
  FluentRefFolderAddFilledIcon: "folder_add_16_filled",
  FluentRefDocumentAddIcon: "document_add_16_regular",
  FluentRefDocumentAddFilledIcon: "document_add_16_filled",
  FluentRefShuffleIcon: "arrow_shuffle_16_regular",
  FluentRefShuffleFilledIcon: "arrow_shuffle_16_filled",
  FluentRefFingerprintIcon: "fingerprint_16_regular",
  FluentRefFingerprintFilledIcon: "fingerprint_16_filled",
  FluentRefGaugeIcon: "gauge_16_regular",
  FluentRefGaugeFilledIcon: "gauge_16_filled",
  FluentRefChatAddIcon: "chat_add_16_regular",
  FluentRefChatAddFilledIcon: "chat_add_16_filled",
  FluentRefCloudOffIcon: "cloud_off_16_regular",
  FluentRefCloudOffFilledIcon: "cloud_off_16_filled",
  FluentRefFolderOpenIcon: "folder_open_16_regular",
  FluentRefFolderOpenFilledIcon: "folder_open_16_filled",
  FluentRefMailOpenIcon: "mail_read_16_regular",
  FluentRefMailOpenFilledIcon: "mail_read_16_filled",
  FluentRefTimerIcon: "timer_16_regular",
  FluentRefTimerFilledIcon: "timer_16_filled",
  FluentRefLaptopIcon: "laptop_16_regular",
  FluentRefLaptopFilledIcon: "laptop_16_filled",
  FluentRefTabletIcon: "tablet_16_regular",
  FluentRefTabletFilledIcon: "tablet_16_filled",
  FluentRefTvIcon: "tv_16_regular",
  FluentRefTvFilledIcon: "tv_16_filled",
  FluentRefWatchIcon: "smartwatch_20_regular",
  FluentRefWatchFilledIcon: "smartwatch_20_filled",
  FluentRefSpeakerIcon: "speaker_box_16_regular",
  FluentRefSpeakerFilledIcon: "speaker_box_16_filled",
  FluentRefHardDriveIcon: "hard_drive_16_regular",
  FluentRefHardDriveFilledIcon: "hard_drive_16_filled",
  FluentRefChipIcon: "developer_board_16_regular",
  FluentRefChipFilledIcon: "developer_board_16_filled",
  FluentRefCalendarCheckIcon: "calendar_checkmark_16_regular",
  FluentRefCalendarCheckFilledIcon: "calendar_checkmark_16_filled",
  FluentRefDocumentCheckIcon: "document_checkmark_16_regular",
  FluentRefDocumentCheckFilledIcon: "document_checkmark_16_filled",
  FluentRefPersonCheckIcon: "person_available_16_regular",
  FluentRefPersonCheckFilledIcon: "person_available_16_filled",
  FluentRefShieldCheckIcon: "shield_checkmark_16_regular",
  FluentRefShieldCheckFilledIcon: "shield_checkmark_16_filled",
  FluentRefBarChartIcon: "data_bar_vertical_16_regular",
  FluentRefBarChartFilledIcon: "data_bar_vertical_16_filled",
  FluentRefPieChartIcon: "data_pie_16_regular",
  FluentRefPieChartFilledIcon: "data_pie_16_filled",
  FluentRefAddCircleIcon: "add_circle_16_regular",
  FluentRefAddCircleFilledIcon: "add_circle_16_filled",
  FluentRefRemoveCircleIcon: "subtract_circle_16_regular",
  FluentRefRemoveCircleFilledIcon: "subtract_circle_16_filled",
  FluentRefProhibitedIcon: "prohibited_16_regular",
  FluentRefProhibitedFilledIcon: "prohibited_16_filled",
  FluentRefChevronsUpDownIcon: "chevron_up_down_16_regular",
  FluentRefChevronsUpDownFilledIcon: "chevron_up_down_16_filled",
  FluentRefCollapseIcon: "arrow_minimize_16_regular",
  FluentRefCollapseFilledIcon: "arrow_minimize_16_filled",
  FluentRefAlarmIcon: "clock_alarm_16_regular",
  FluentRefAlarmFilledIcon: "clock_alarm_16_filled",
  FluentRefGitBranchIcon: "branch_16_regular",
  FluentRefGitBranchFilledIcon: "branch_16_filled",
  FluentRefGripVerticalIcon: "re_order_dots_vertical_16_regular",
  FluentRefGripVerticalFilledIcon: "re_order_dots_vertical_16_filled",
  FluentRefActivityIcon: "pulse_20_regular",
  FluentRefActivityFilledIcon: "pulse_20_filled",
  FluentRefLayoutIcon: "layout_row_two_split_top_16_regular",
  FluentRefLayoutFilledIcon: "layout_row_two_split_top_16_filled",
  FluentRefCallIcon: "call_16_regular",
  FluentRefCallFilledIcon: "call_16_filled",
  FluentRefReplyIcon: "arrow_reply_16_regular",
  FluentRefReplyFilledIcon: "arrow_reply_16_filled",
  FluentRefSyncIcon: "arrow_sync_16_regular",
  FluentRefSyncFilledIcon: "arrow_sync_16_filled",
  FluentRefEraserIcon: "eraser_20_regular",
  FluentRefEraserFilledIcon: "eraser_20_filled",
  FluentRefTextAlignLeftIcon: "text_align_left_16_regular",
  FluentRefTextAlignLeftFilledIcon: "text_align_left_16_filled",
  FluentRefTextAlignCenterIcon: "text_align_center_16_regular",
  FluentRefTextAlignCenterFilledIcon: "text_align_center_16_filled",
  FluentRefIndentIcon: "text_indent_increase_ltr_16_regular",
  FluentRefIndentFilledIcon: "text_indent_increase_ltr_16_filled",
  FluentRefOutdentIcon: "text_indent_decrease_ltr_16_regular",
  FluentRefOutdentFilledIcon: "text_indent_decrease_ltr_16_filled",
  FluentRefColumnsIcon: "layout_column_two_16_regular",
  FluentRefColumnsFilledIcon: "layout_column_two_16_filled",
  FluentRefFolderRemoveIcon: "folder_dismiss_16_regular",
  FluentRefFolderRemoveFilledIcon: "folder_dismiss_16_filled",
  FluentRefDocumentRemoveIcon: "document_dismiss_16_regular",
  FluentRefDocumentRemoveFilledIcon: "document_dismiss_16_filled",
  FluentRefDatabaseIcon: "database_16_regular",
  FluentRefDatabaseFilledIcon: "database_16_filled",
  FluentRefServerIcon: "server_16_regular",
  FluentRefServerFilledIcon: "server_16_filled",
  FluentRefScissorsIcon: "cut_16_regular",
  FluentRefScissorsFilledIcon: "cut_16_filled",
  FluentRefLogInIcon: "arrow_enter_16_regular",
  FluentRefLogInFilledIcon: "arrow_enter_16_filled",
  FluentRefLogOutIcon: "arrow_exit_16_regular",
  FluentRefLogOutFilledIcon: "arrow_exit_16_filled",
  FluentRefKeyboardIcon: "keyboard_16_regular",
  FluentRefKeyboardFilledIcon: "keyboard_16_filled",
  FluentRefPointerIcon: "cursor_16_regular",
  FluentRefPointerFilledIcon: "cursor_16_filled",
  FluentRefMoveIcon: { id: "arrow_move_20_regular", size: 20 },
  FluentRefMoveFilledIcon: { id: "arrow_move_20_filled", size: 20 },
  FluentRefHourglassIcon: "hourglass_16_regular",
  FluentRefHourglassFilledIcon: "hourglass_16_filled",
  FluentRefLoaderIcon: "spinner_ios_16_regular",
  FluentRefLoaderFilledIcon: "spinner_ios_16_filled",
  FluentRefThumbsUpIcon: "thumb_like_16_regular",
  FluentRefThumbsUpFilledIcon: "thumb_like_16_filled",
  FluentRefSmileIcon: "emoji_16_regular",
  FluentRefSmileFilledIcon: "emoji_16_filled",
  FluentRefBriefcaseIcon: "briefcase_16_regular",
  FluentRefBriefcaseFilledIcon: "briefcase_16_filled",
  FluentRefBuildingIcon: "building_16_regular",
  FluentRefBuildingFilledIcon: "building_16_filled",
  FluentRefCompassIcon: "compass_northwest_16_regular",
  FluentRefCompassFilledIcon: "compass_northwest_16_filled",
  FluentRefCropIcon: "crop_16_regular",
  FluentRefCropFilledIcon: "crop_16_filled",
  FluentRefTrophyIcon: "trophy_16_regular",
  FluentRefTrophyFilledIcon: "trophy_16_filled",
  FluentRefCoffeeIcon: "drink_coffee_16_regular",
  FluentRefCoffeeFilledIcon: "drink_coffee_16_filled",
  FluentRefLockIcon: "lock_closed_16_regular",
  FluentRefLockFilledIcon: "lock_closed_16_filled",
  FluentRefStarIcon: "star_16_regular",
  FluentRefStarFilledIcon: "star_16_filled",
  FluentRefHeartIcon: "heart_16_regular",
  FluentRefHeartFilledIcon: "heart_16_filled",
  FluentRefCalendarIcon: "calendar_ltr_16_regular",
  FluentRefCalendarFilledIcon: "calendar_ltr_16_filled",
  FluentRefClockIcon: "clock_16_regular",
  FluentRefClockFilledIcon: "clock_16_filled",
  FluentRefPencilIcon: "edit_16_regular",
  FluentRefPencilFilledIcon: "edit_16_filled",
  FluentRefDownloadIcon: "arrow_download_16_regular",
  FluentRefDownloadFilledIcon: "arrow_download_16_filled",
  FluentRefUploadIcon: "arrow_upload_16_regular",
  FluentRefUploadFilledIcon: "arrow_upload_16_filled",
  FluentRefFilterIcon: "filter_16_regular",
  FluentRefFilterFilledIcon: "filter_16_filled",
  FluentRefSortIcon: "arrow_sort_16_regular",
  FluentRefSortFilledIcon: "arrow_sort_16_filled",
  FluentRefSparkleIcon: "sparkle_16_regular",
  FluentRefSparkleFilledIcon: "sparkle_16_filled",
  FluentRefPinIcon: "location_16_regular",
  FluentRefPinFilledIcon: "location_16_filled",
  FluentRefMinusIcon: "subtract_16_regular",
  FluentRefMinusFilledIcon: "subtract_16_filled",
  FluentRefSendIcon: "send_16_regular",
  FluentRefSendFilledIcon: "send_16_filled",
  FluentRefRefreshIcon: "arrow_clockwise_16_regular",
  FluentRefRefreshFilledIcon: "arrow_clockwise_16_filled",
  FluentRefHomeIcon: "home_16_regular",
  FluentRefHomeFilledIcon: "home_16_filled",
  FluentRefMailIcon: "mail_16_regular",
  FluentRefMailFilledIcon: "mail_16_filled",
  FluentRefChatIcon: "chat_16_regular",
  FluentRefChatFilledIcon: "chat_16_filled",
  FluentRefImageIcon: "image_16_regular",
  FluentRefImageFilledIcon: "image_16_filled",
  FluentRefMicIcon: "mic_16_regular",
  FluentRefMicFilledIcon: "mic_16_filled",
  FluentRefHelpIcon: "question_circle_16_regular",
  FluentRefHelpFilledIcon: "question_circle_16_filled",
  FluentRefBookmarkIcon: "bookmark_16_regular",
  FluentRefBookmarkFilledIcon: "bookmark_16_filled",
  FluentRefMenuIcon: "navigation_16_regular",
  FluentRefMenuFilledIcon: "navigation_16_filled",
  FluentRefGridIcon: "grid_16_regular",
  FluentRefGridFilledIcon: "grid_16_filled",
  FluentRefMoreVerticalIcon: "more_vertical_16_regular",
  FluentRefMoreVerticalFilledIcon: "more_vertical_16_filled",
  FluentRefPlayIcon: "play_16_regular",
  FluentRefPlayFilledIcon: "play_16_filled",
  FluentRefPauseIcon: "pause_16_regular",
  FluentRefPauseFilledIcon: "pause_16_filled",
  FluentRefUndoIcon: "arrow_undo_16_regular",
  FluentRefUndoFilledIcon: "arrow_undo_16_filled",
  FluentRefRedoIcon: "arrow_redo_16_regular",
  FluentRefRedoFilledIcon: "arrow_redo_16_filled",
  FluentRefSunIcon: "weather_sunny_16_regular",
  FluentRefSunFilledIcon: "weather_sunny_16_filled",
  FluentRefMoonIcon: "weather_moon_16_regular",
  FluentRefMoonFilledIcon: "weather_moon_16_filled",
  FluentRefDesktopIcon: "desktop_16_regular",
  FluentRefDesktopFilledIcon: "desktop_16_filled",
  FluentRefCodeIcon: "code_16_regular",
  FluentRefCodeFilledIcon: "code_16_filled",
  FluentRefTerminalIcon: "code_block_16_regular",
  FluentRefTerminalFilledIcon: "code_block_16_filled",
  FluentRefErrorIcon: "dismiss_circle_16_regular",
  FluentRefErrorFilledIcon: "dismiss_circle_16_filled",
  FluentRefUnlockIcon: "lock_open_16_regular",
  FluentRefUnlockFilledIcon: "lock_open_16_filled",
  FluentRefShareIcon: "share_16_regular",
  FluentRefShareFilledIcon: "share_16_filled",
  FluentRefGlobeIcon: "globe_16_regular",
  FluentRefGlobeFilledIcon: "globe_16_filled",
  FluentRefAttachIcon: "attach_16_regular",
  FluentRefAttachFilledIcon: "attach_16_filled",
  FluentRefTagIcon: "tag_16_regular",
  FluentRefTagFilledIcon: "tag_16_filled",
  FluentRefPeopleIcon: "people_16_regular",
  FluentRefPeopleFilledIcon: "people_16_filled",
  FluentRefZoomInIcon: "zoom_in_16_regular",
  FluentRefZoomInFilledIcon: "zoom_in_16_filled",
  FluentRefZoomOutIcon: "zoom_out_16_regular",
  FluentRefZoomOutFilledIcon: "zoom_out_16_filled",
  FluentRefFlagIcon: "flag_16_regular",
  FluentRefFlagFilledIcon: "flag_16_filled",
  FluentRefArchiveIcon: "archive_16_regular",
  FluentRefArchiveFilledIcon: "archive_16_filled",
  FluentRefCloudIcon: "cloud_16_regular",
  FluentRefCloudFilledIcon: "cloud_16_filled",
  FluentRefPhoneIcon: "phone_16_regular",
  FluentRefPhoneFilledIcon: "phone_16_filled",
  FluentRefCameraIcon: "camera_16_regular",
  FluentRefCameraFilledIcon: "camera_16_filled",
  FluentRefCartIcon: "cart_16_regular",
  FluentRefCartFilledIcon: "cart_16_filled",
  FluentRefBoldIcon: "text_bold_16_regular",
  FluentRefBoldFilledIcon: "text_bold_16_filled",
  FluentRefItalicIcon: "text_italic_16_regular",
  FluentRefItalicFilledIcon: "text_italic_16_filled",
  FluentRefUnderlineIcon: "text_underline_16_regular",
  FluentRefUnderlineFilledIcon: "text_underline_16_filled",
  FluentRefQuoteIcon: "text_quote_16_regular",
  FluentRefQuoteFilledIcon: "text_quote_16_filled",
  FluentRefHashIcon: "number_symbol_16_regular",
  FluentRefHashFilledIcon: "number_symbol_16_filled",
  FluentRefAtIcon: "mention_16_regular",
  FluentRefAtFilledIcon: "mention_16_filled",
  FluentRefKeyIcon: "key_16_regular",
  FluentRefKeyFilledIcon: "key_16_filled",
  FluentRefShieldIcon: "shield_16_regular",
  FluentRefShieldFilledIcon: "shield_16_filled",
  FluentRefGiftIcon: "gift_16_regular",
  FluentRefGiftFilledIcon: "gift_16_filled",
  FluentRefMapIcon: "map_16_regular",
  FluentRefMapFilledIcon: "map_16_filled",
  FluentRefChartIcon: "data_line_16_regular",
  FluentRefChartFilledIcon: "data_line_16_filled",
  FluentRefTableIcon: "table_16_regular",
  FluentRefTableFilledIcon: "table_16_filled",
  FluentRefStrikethroughIcon: "text_strikethrough_16_regular",
  FluentRefStrikethroughFilledIcon: "text_strikethrough_16_filled",
  FluentRefHeadingIcon: { id: "text_header_1_20_regular", size: 20 },
  FluentRefHeadingFilledIcon: { id: "text_header_1_20_filled", size: 20 },
  FluentRefListBulletIcon: "text_bullet_list_ltr_16_regular",
  FluentRefListBulletFilledIcon: "text_bullet_list_ltr_16_filled",
  FluentRefWifiIcon: { id: "wifi_1_20_regular", size: 20 },
  FluentRefWifiFilledIcon: { id: "wifi_1_20_filled", size: 20 },
  FluentRefBluetoothIcon: "bluetooth_16_regular",
  FluentRefBluetoothFilledIcon: "bluetooth_16_filled",
  FluentRefBatteryIcon: "battery_10_16_regular",
  FluentRefBatteryFilledIcon: "battery_10_16_filled",
  FluentRefPlugIcon: "plug_connected_16_regular",
  FluentRefPlugFilledIcon: "plug_connected_16_filled",
  FluentRefPowerIcon: { id: "power_20_regular", size: 20 },
  FluentRefPowerFilledIcon: { id: "power_20_filled", size: 20 },
  FluentRefPrinterIcon: "print_16_regular",
  FluentRefPrinterFilledIcon: "print_16_filled",
  FluentRefHeadphonesIcon: "headphones_16_regular",
  FluentRefHeadphonesFilledIcon: "headphones_16_filled",
  FluentRefVideoIcon: "video_16_regular",
  FluentRefVideoFilledIcon: "video_16_filled",
  FluentRefInboxIcon: "mail_inbox_16_regular",
  FluentRefInboxFilledIcon: "mail_inbox_16_filled",
  PresenceAvailableIcon: "presence_available_16_regular",
  // Fluent filled references for the pilot's filled variants.
  FluentBellFilledIcon: "alert_16_filled",
  FluentInfoFilledIcon: "info_16_filled",
  FluentSettingsFilledIcon: "settings_16_filled",
  FluentEyeFilledIcon: "eye_16_filled",
  FluentAlignLeftFilledIcon: "align_left_16_filled",
  FluentCheckCircleFilledIcon: "checkmark_circle_16_filled",
  FluentCopyIcon: "copy_16_regular",
  FluentDocumentFilledIcon: "document_16_filled",
  FluentFolderFilledIcon: "folder_16_filled",
  FluentCopyFilledIcon: "copy_16_filled",
  FluentTrashFilledIcon: "delete_16_filled",
  FluentWarningFilledIcon: "warning_16_filled",
  FluentResetIcon: "arrow_counterclockwise_16_regular",
  FluentChevronLeftIcon: "chevron_left_16_regular",
  FluentChevronRightIcon: "chevron_right_16_regular",
  FluentChevronUpIcon: "chevron_up_16_regular",
  FluentArrowLeftIcon: "arrow_left_16_regular",
  FluentArrowDownIcon: "arrow_down_16_regular",
  // Card templates (media controls, weather, trends).
  FluentPlayFilledIcon: "play_16_filled",
  FluentPauseFilledIcon: "pause_16_filled",
  FluentNextFilledIcon: "next_16_filled",
  FluentPreviousFilledIcon: "previous_16_filled",
  FluentWeatherSunnyIcon: "weather_sunny_16_regular",
  FluentWeatherPartlyCloudyIcon: "weather_partly_cloudy_day_16_regular",
  FluentArrowTrendingIcon: "arrow_trending_16_regular",
  FluentArrowUpRightIcon: "arrow_up_right_16_regular",
  FluentHeartIcon: "heart_16_regular",
  FluentAlignRightIcon: "align_right_16_regular",
  FluentAlignCenterIcon: "align_center_horizontal_16_regular",
  FluentExpandIcon: "arrow_expand_16_regular",
  FluentExpandFilledIcon: "arrow_expand_16_filled",
  FluentPanelLeftIcon: "panel_left_16_regular",
  FluentPanelLeftFilledIcon: "panel_left_16_filled",
  FluentPanelRightIcon: "panel_right_16_regular",
  FluentPanelRightFilledIcon: "panel_right_16_filled",
  FluentBookIcon: "book_open_16_regular",
  FluentBookFilledIcon: "book_open_16_filled",
  FluentOptionsIcon: "options_16_regular",
  FluentOptionsFilledIcon: "options_16_filled",
  FluentColorIcon: "color_16_regular",
  FluentColorFilledIcon: "color_16_filled",
  FluentTextIcon: "text_font_16_regular",
  FluentTextFilledIcon: "text_font_16_filled",
  FluentShapesIcon: "shapes_16_regular",
  FluentShapesFilledIcon: "shapes_16_filled",
  FluentListIcon: "line_horizontal_4_16_regular",
  FluentListFilledIcon: "line_horizontal_4_16_filled",
  FluentSquareDashedIcon: "square_hint_16_regular",
  FluentSquareDashedFilledIcon: "square_hint_16_filled",
  FluentLayersIcon: "layer_diagonal_16_regular",
  FluentLayersFilledIcon: "layer_diagonal_16_filled",
  FluentFlashIcon: "flash_16_regular",
  FluentFlashFilledIcon: "flash_16_filled",
};
// Inline SVG for the documentation's own chrome: toolbars, and the sidebar's section
// icons. Keyed by the page slug where it names one, so a new foundation page gets an icon
// by adding one line here rather than by editing markup.
const TOOLBAR = {
  copy: "copy_16_regular",
  check: "checkmark_16_regular",
  reset: "arrow_counterclockwise_16_regular",
  expand: "arrow_expand_16_regular",
  close: "dismiss_16_regular",
  panelLeft: "panel_left_16_regular",
  panelRight: "panel_right_16_regular",
  // Getting started
  // Keyed by page slug; the Introduction page ships as index.html.
  index: "book_open_16_regular",
  axes: "options_16_regular",
  // Foundations
  color: "color_16_regular",
  typography: "text_font_16_regular",
  iconography: "shapes_16_regular",
  density: "line_horizontal_4_16_regular",
  radius: "square_hint_16_regular",
  surface: "layer_diagonal_16_regular",
  motion: "flash_16_regular",
};
/** kebab -> Pascal, so `flow-wrap` exports as `FlowWrapIcon`. */
const pascal = (name) => name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());

/*
 * SVG attributes are hyphenated; JSX wants them camelCased. Only the attributes this set
 * actually uses are converted -- an unknown one would be passed through and silently
 * dropped by React, so the list is deliberately closed rather than a general rule.
 */
const JSX_ATTRS = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-miterlimit": "strokeMiterlimit",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
};

const jsx = (markup) => {
  let out = markup;
  for (const [from, to] of Object.entries(JSX_ATTRS)) out = out.replaceAll(`${from}=`, `${to}=`);
  const unknown = out.match(/\s([a-z]+-[a-z-]+)=/);
  if (unknown) throw new Error(`unconverted SVG attribute "${unknown[1]}" -- add it to JSX_ATTRS`);
  return out.replace(/>(?=<)/g, ">\n    ");
};

const path = (id) => {
  const svg = readFileSync(`${DIR}/${id}.svg`, "utf8");
  const ds = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  if (!ds.length) throw new Error(`no path in ${id}`);
  return ds;
};
const tsx = `/**
 * Fluent System Icons, primarily 16px Regular with explicit component-sized cuts.
 *
 * Microsoft's set, taken verbatim from \`@fluentui/svg-icons\` -- the path data below is
 * generated from that package, never drawn by hand. Fluent's 16px grid is the same inline
 * size Area's density axis uses, so an icon here needs no rescaling to sit on a control.
 *
 * Two things follow from using the real set rather than approximating it. Fluent icons are
 * *filled* paths, not strokes, so they take \`fill\` and never \`stroke\` or \`stroke-width\`;
 * and they are optically corrected per size, so a component-owned 20px slot uses the
 * 20px cut rather than scaling a 16px path.
 *
 * Regenerate with \`node scripts/gen-icons.mjs\` after changing the map there.
 */
const base = {
  viewBox: "0 0 16 16",
  // Fluent's own intrinsic size. A slot that owns an icon token overrides it in CSS;
  // this is only the fallback for an icon rendered outside one.
  width: 16,
  height: 16,
  fill: "currentColor",
  focusable: false as const,
  "aria-hidden": true,
};

const base20 = { ...base, viewBox: "0 0 20 20", width: 20, height: 20 };

${Object.entries(MAP)
  .map(
    ([name, definition]) => {
      const { id, size = 16 } = typeof definition === "string" ? { id: definition, size: 16 } : definition;
      const iconBase = size === 16 ? "base" : `base${size}`;
      return `/** Fluent \`${id}\`. */\nexport const ${name} = () => (\n  <svg {...${iconBase}}>\n${path(id)
        .map((d) => `    <path d="${d}" />`)
        .join("\n")}\n  </svg>\n);`;
    },
  )
  .join("\n\n")}

/*
 * Area's marks. They are stroked rather than filled, so they take their own base: the
 * fill is off and the colour rides on the stroke. Fitted to Fluent's optical weight by
 * measurement -- see the note in gen-icons.mjs.
 */
const areaBase = { ...base, fill: "none" };

${Object.entries(AREA)
  .map(
    ([name, inner]) =>
      `/** Area \`${name}\`. */\nexport const ${pascal(name)}Icon = () => (\n  <svg {...areaBase}>\n    ${jsx(inner)}\n  </svg>\n);`,
  )
  .join("\n\n")}
`;
writeFileSync(join(ROOT, "src/icons.tsx"), tsx);

const js = `/**
 * Toolbar icons: Fluent System Icons, 16px Regular, generated from \`@fluentui/svg-icons\`.
 * Filled paths, sized from CSS and never from font-size.
 */
export const ICONS = {
${Object.entries(TOOLBAR)
  .map(
    ([k, id]) =>
      `  // Fluent \`${id}\`\n  ${k}: \`<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">${path(id)
        .map((d) => `<path d="${d}"/>`)
        .join("")}</svg>\`,`,
  )
  .join("\n")}
};`;
writeFileSync(join(ROOT, "scripts/icons.generated.mjs"), js);

/* --- The catalogue and its sprites ---------------------------------------- */

/*
 * The browser documents the whole set, not a curated corner of it, which is 1,710 Fluent
 * glyphs on the 16 grid plus Area's 29 -- 711 KB of path data in one style alone. Inlined
 * per page that is unservable, so the marks ship as two SVG sprites and the page carries
 * `<use>` references: one element per cell, and the sprite cached once for the whole site.
 *
 * Two files rather than one because style is a filter. A reader looking at regular never
 * pays for filled, and the browser swaps the href prefix rather than loading both up front.
 */
const fluentIds = (style) =>
  readdirSync(DIR)
    .filter((f) => f.endsWith(`_16_${style}.svg`))
    .map((f) => f.replace(`_16_${style}.svg`, ""))
    .sort();

const REGULAR = fluentIds("regular");
const FILLED = new Set(fluentIds("filled"));

/** Fluent's ids are snake_case; the catalogue is kebab, which is what a reader searches. */
const kebab = (id) => id.replace(/_/g, "-");

function sprite(style) {
  const symbols = [];
  for (const [name, inner] of Object.entries(style === "filled" ? AREA_FILLED : AREA)) {
    symbols.push(`<symbol id="area-${name}" viewBox="0 0 16 16" fill="none">${inner}</symbol>`);
  }
  for (const id of REGULAR) {
    // A Fluent glyph with no filled cut falls back to its regular one, so every cell in the
    // grid draws something rather than leaving a hole where a style does not exist.
    const use = style === "filled" && FILLED.has(id) ? "filled" : "regular";
    const svg = readFileSync(`${DIR}/${id}_16_${use}.svg`, "utf8");
    const ds = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
    if (!ds.length) continue;
    symbols.push(
      `<symbol id="fl-${kebab(id)}" viewBox="0 0 16 16">${ds.map((d) => `<path d="${d}"/>`).join("")}</symbol>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>`;
}

writeFileSync(`${ASSETS}/icons.svg`, sprite("regular"));
writeFileSync(`${ASSETS}/icons-filled.svg`, sprite("filled"));

/*
 * The catalogue carries names, not geometry -- the sprite has the geometry. Each entry also
 * carries its search terms, split here rather than in the browser so the page does no work
 * a build can do once.
 */
const catalog = [
  ...Object.keys(AREA).sort().map((name) => ({ id: `area-${name}`, name, source: "area" })),
  ...REGULAR.map((id) => ({ id: `fl-${kebab(id)}`, name: kebab(id), source: "fluent", filled: FILLED.has(id) })),
].map((entry) => ({ ...entry, terms: entry.name.split("-").join(" ") }));

writeFileSync(
  join(ROOT, "scripts/icons.catalog.mjs"),
  `/**
 * The icon catalogue: every mark the browser lists, by name and sprite id.
 *
 * Generated by \`scripts/gen-icons.mjs\`. Geometry lives in \`assets/icons.svg\` and
 * \`assets/icons-filled.svg\`; this file is only what a reader searches and filters on.
 */
export const CATALOG = ${JSON.stringify(catalog)};
`,
);

console.log(
  "generated",
  Object.keys(MAP).length,
  "component icons,",
  Object.keys(TOOLBAR).length,
  "toolbar icons,",
  catalog.length,
  `catalogued (${Object.keys(AREA).length} Area + ${REGULAR.length} Fluent)`,
);

// Presence status glyphs are Area-drawn since 2026-09-25: see apps/docs/assets/area-icons-pilot/status
// and scripts/gen-pilot-icons.mjs.

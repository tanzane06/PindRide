export const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    // General
    'app_title': 'Live Bus Tracker',
    'min_short': 'min',
    'favourite_routes': 'Favourite Routes',
    'rupee_symbol': '₹',

    // Nav
    'nav_home': 'Home',
    'nav_routes': 'Routes',
    'nav_sms': 'SMS',
    'nav_profile': 'Profile',

    // Home Screen
    'home_welcome': 'Welcome!',
    'home_heading': 'Where are you heading today?',
    'home_from': 'FROM',
    'home_to': 'TO',
    'home_select_boarding': 'Select Boarding Stop',
    'home_select_destination': 'Select Destination Stop',
    'home_view_map': 'View Live Map',
    'home_next_bus_in': 'Next bus at {stopName} in',
    'home_show_route': 'Show Route Details',
    'home_no_route_found': 'No Route Found',
    'home_no_route_desc': 'There are no direct buses available for the selected route.',
    'ticket_price': 'Ticket Price',
    'delay_info': 'Delayed: {reason}',

    // Routes Screen
    'routes_all': 'All Routes',
    'routes_search_placeholder': 'Search routes by name or stop...',
    'routes_back': '← All Routes',
    'routes_direction_to': 'Direction: To {terminusName}',
    'routes_boarding': 'BOARDING',
    'routes_destination': 'DESTINATION',
    'routes_select_stop': 'Select Stop',
    'routes_clear_selection': 'Clear Selection',
    'routes_selecting_stop_banner': 'Select a {selectionType} stop from the list below.',
    'routes_passed': 'Passed',
    'routes_due': 'Due',
    'routes_subscribe_sms': 'Subscribe via SMS',
    'trip_details': 'Trip Details',
    'stops': 'Stops',
    
    // SMS Screen
    'sms_title': 'No Data? No Problem.',
    'sms_description': 'Get bus arrival times directly on your phone via SMS, even without an internet connection.',
    'sms_send_to': 'Send an SMS to:',
    'sms_with_message': 'With the message:',
    'sms_route_number': 'RouteNumber',

    // Profile Screen
    'profile_settings': 'Profile & Settings',
    'profile_account': 'Account',
    'profile_guest_user': 'Guest User',
    'profile_account_desc': 'Manage your profile information',
    'profile_preferences': 'Preferences',
    'profile_notifications': 'Push Notifications',
    'profile_notifications_desc': 'Get alerts for bus delays.',
    'profile_dark_mode': 'Dark Mode',
    'profile_dark_mode_desc': 'Reduces eye strain in low light.',
    'profile_accessibility': 'Accessibility',
    'profile_low_bw_mode': 'Low Bandwidth Mode',
    'profile_low_bw_desc': 'Uses a simplified, text-only home screen.',
    'profile_language': 'Language',
    
    // Map
    'map_live': 'Live Map',
    'map_offline': 'Offline: Updated {time}',
    'map_eta_terminus': 'Terminus ETA: {eta} min',
    'map_at_terminus': 'At terminus',
  },
  pa: {
    // General
    'app_title': 'ਲਾਈਵ ਬੱਸ ਟਰੈਕਰ',
    'min_short': 'ਮਿੰਟ',
    'favourite_routes': 'ਮਨਪਸੰਦ ਰੂਟ',
    'rupee_symbol': '₹',

    // Nav
    'nav_home': 'ਹੋਮ',
    'nav_routes': 'ਰੂਟ',
    'nav_sms': 'SMS',
    'nav_profile': 'ਪ੍ਰੋਫਾਈਲ',

    // Home Screen
    'home_welcome': 'ਜੀ ਆਇਆਂ ਨੂੰ!',
    'home_heading': 'ਤੁਸੀਂ ਅੱਜ ਕਿੱਥੇ ਜਾ ਰਹੇ ਹੋ?',
    'home_from': 'ਤੋਂ',
    'home_to': 'ਨੂੰ',
    'home_select_boarding': 'ਬੋਰਡਿੰਗ ਸਟਾਪ ਚੁਣੋ',
    'home_select_destination': 'ਮੰਜ਼ਿਲ ਸਟਾਪ ਚੁਣੋ',
    'home_view_map': 'ਲਾਈਵ ਨਕਸ਼ਾ ਵੇਖੋ',
    'home_next_bus_in': '{stopName} \'ਤੇ ਅਗਲੀ ਬੱਸ',
    'home_show_route': 'ਰੂਟ ਦੇ ਵੇਰਵੇ ਵੇਖੋ',
    'home_no_route_found': 'ਕੋਈ ਰੂਟ ਨਹੀਂ ਮਿਲਿਆ',
    'home_no_route_desc': 'ਚੁਣੇ ਗਏ ਰੂਟ ਲਈ ਕੋਈ ਸਿੱਧੀ ਬੱਸ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।',
    'ticket_price': 'ਟਿਕਟ ਦੀ ਕੀਮਤ',
    'delay_info': 'ਦੇਰੀ: {reason}',

    // Routes Screen
    'routes_all': 'ਸਾਰੇ ਰੂਟ',
    'routes_search_placeholder': 'ਨਾਮ ਜਾਂ ਸਟਾਪ ਦੁਆਰਾ ਰੂਟ ਖੋਜੋ...',
    'routes_back': '← ਸਾਰੇ ਰੂਟ',
    'routes_direction_to': 'ਦਿਸ਼ਾ: {terminusName} ਨੂੰ',
    'routes_boarding': 'ਬੋਰਡਿੰਗ',
    'routes_destination': 'ਮੰਜ਼ਿਲ',
    'routes_select_stop': 'ਸਟਾਪ ਚੁਣੋ',
    'routes_clear_selection': 'ਚੋਣ ਸਾਫ਼ ਕਰੋ',
    'routes_selecting_stop_banner': 'ਹੇਠਾਂ ਦਿੱਤੀ ਸੂਚੀ ਵਿੱਚੋਂ ਇੱਕ {selectionType} ਸਟਾਪ ਚੁਣੋ।',
    'routes_passed': 'ਲੰਘ ਗਈ',
    'routes_due': 'ਆਉਣ ਵਾਲੀ',
    'routes_subscribe_sms': 'SMS ਰਾਹੀਂ ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ',
    'trip_details': 'ਯਾਤਰਾ ਦੇ ਵੇਰਵੇ',
    'stops': 'ਸਟਾਪ',
    
    // SMS Screen
    'sms_title': 'ਕੋਈ ਡਾਟਾ ਨਹੀਂ? ਕੋਈ ਸਮੱਸਿਆ ਨਹੀਂ।',
    'sms_description': 'ਬਿਨਾਂ ਇੰਟਰਨੈਟ ਕਨੈਕਸ਼ਨ ਦੇ ਵੀ, SMS ਰਾਹੀਂ ਆਪਣੇ ਫ਼ੋਨ \'ਤੇ ਸਿੱਧੇ ਬੱਸ ਆਉਣ ਦਾ ਸਮਾਂ ਪ੍ਰਾਪਤ ਕਰੋ।',
    'sms_send_to': 'ਇਸ ਨੰਬਰ \'ਤੇ SMS ਭੇਜੋ:',
    'sms_with_message': 'ਇਸ ਸੰਦੇਸ਼ ਨਾਲ:',
    'sms_route_number': 'ਰੂਟਨੰਬਰ',

    // Profile Screen
    'profile_settings': 'ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਜ਼',
    'profile_account': 'ਖਾਤਾ',
    'profile_guest_user': 'ਮਹਿਮਾਨ ਉਪਭੋਗਤਾ',
    'profile_account_desc': 'ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਜਾਣਕਾਰੀ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',
    'profile_preferences': 'ਪਸੰਦਾਂ',
    'profile_notifications': 'ਪੁਸ਼ ਸੂਚਨਾਵਾਂ',
    'profile_notifications_desc': 'ਬੱਸ ਦੀ ਦੇਰੀ ਲਈ ਚੇਤਾਵਨੀਆਂ ਪ੍ਰਾਪਤ ਕਰੋ।',
    'profile_dark_mode': 'ਡਾਰਕ ਮੋਡ',
    'profile_dark_mode_desc': 'ਘੱਟ ਰੋਸ਼ਨੀ ਵਿੱਚ ਅੱਖਾਂ ਦਾ ਦਬਾਅ ਘਟਾਉਂਦਾ ਹੈ।',
    'profile_accessibility': 'ਪਹੁੰਚਯੋਗਤਾ',
    'profile_low_bw_mode': 'ਘੱਟ ਬੈਂਡਵਿਡਥ ਮੋਡ',
    'profile_low_bw_desc': 'ਇੱਕ ਸਰਲ, ਸਿਰਫ-ਟੈਕਸਟ ਹੋਮ ਸਕ੍ਰੀਨ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ।',
    'profile_language': 'ਭਾਸ਼ਾ',

    // Map
    'map_live': 'ਲਾਈਵ ਨਕਸ਼ਾ',
    'map_offline': 'ਔਫਲਾਈਨ: ਅੱਪਡੇਟ ਕੀਤਾ {time}',
    'map_eta_terminus': 'ਟਰਮਿਨਸ ETA: {eta} ਮਿੰਟ',
    'map_at_terminus': 'ਟਰਮਿਨਸ \'ਤੇ',
  }
};
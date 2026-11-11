export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      users: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      business: {
        Row: {
          about: string
          id: number
          phone_display: string
          trading_name: string
          whatsapp_digits: string
          yard_address: string
          yard_label: string
        }
        Insert: {
          about: string
          id?: number
          phone_display: string
          trading_name: string
          whatsapp_digits: string
          yard_address: string
          yard_label: string
        }
        Update: {
          about?: string
          id?: number
          phone_display?: string
          trading_name?: string
          whatsapp_digits?: string
          yard_address?: string
          yard_label?: string
        }
        Relationships: []
      }
      configurations: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          blurb: string
          day_package_inr: number | null
          day_rate_inr: number | null
          id: string
          kilometre_rate_inr: number | null
          name: string
          sort_order: number
          transfer_rate_inr: number | null
        }
        Insert: {
          blurb?: string
          day_package_inr?: number | null
          day_rate_inr?: number | null
          id?: string
          kilometre_rate_inr?: number | null
          name: string
          sort_order?: number
          transfer_rate_inr?: number | null
        }
        Update: {
          blurb?: string
          day_package_inr?: number | null
          day_rate_inr?: number | null
          id?: string
          kilometre_rate_inr?: number | null
          name?: string
          sort_order?: number
          transfer_rate_inr?: number | null
        }
        Relationships: []
      }
      vehicle_photos: {
        Row: {
          id: string
          sort_order: number
          storage_path: string
          vehicle_id: string
        }
        Insert: {
          id?: string
          sort_order?: number
          storage_path: string
          vehicle_id: string
        }
        Update: {
          id?: string
          sort_order?: number
          storage_path?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          airport_direction: Database['public']['Enums']['airport_direction'] | null
          callback_phone: string
          created_at: string
          day_package_count: number | null
          delivery_address: string | null
          destination: string | null
          handover: Database['public']['Enums']['handover'] | null
          hire_kind: Database['public']['Enums']['hire_kind']
          id: string
          meetup_address: string | null
          note: string | null
          pickup_at: string | null
          return_at: string | null
          return_on: string | null
          shown_rate_inr: number
          shown_rate_label: string
          start_on: string | null
          trip_at: string | null
          vehicle_id: string
          vehicle_name: string
          visitor_id: string | null
          visitor_name: string
        }
        Insert: {
          airport_direction?: Database['public']['Enums']['airport_direction'] | null
          callback_phone: string
          created_at?: string
          day_package_count?: number | null
          delivery_address?: string | null
          destination?: string | null
          handover?: Database['public']['Enums']['handover'] | null
          hire_kind: Database['public']['Enums']['hire_kind']
          id?: string
          meetup_address?: string | null
          note?: string | null
          pickup_at?: string | null
          return_at?: string | null
          return_on?: string | null
          shown_rate_inr: number
          shown_rate_label: string
          start_on?: string | null
          trip_at?: string | null
          vehicle_id: string
          vehicle_name: string
          visitor_id?: string | null
          visitor_name: string
        }
        Update: {
          airport_direction?: Database['public']['Enums']['airport_direction'] | null
          callback_phone?: string
          created_at?: string
          day_package_count?: number | null
          delivery_address?: string | null
          destination?: string | null
          handover?: Database['public']['Enums']['handover'] | null
          hire_kind?: Database['public']['Enums']['hire_kind']
          id?: string
          meetup_address?: string | null
          note?: string | null
          pickup_at?: string | null
          return_at?: string | null
          return_on?: string | null
          shown_rate_inr?: number
          shown_rate_label?: string
          start_on?: string | null
          trip_at?: string | null
          vehicle_id?: string
          vehicle_name?: string
          visitor_id?: string | null
          visitor_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      airport_direction: 'to_airport' | 'from_airport'
      handover: 'collection' | 'delivery'
      hire_kind: 'self_drive' | 'airport' | 'local' | 'outstation'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      airport_direction: ['to_airport', 'from_airport'],
      handover: ['collection', 'delivery'],
      hire_kind: ['self_drive', 'airport', 'local', 'outstation'],
    },
  },
} as const

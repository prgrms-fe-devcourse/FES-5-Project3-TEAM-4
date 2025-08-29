export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.4';
  };
  public: {
    Tables: {
      card: {
        Row: {
          arcana: string;
          image_url: string;
          name: string;
        };
        Insert: {
          arcana: string;
          image_url: string;
          name: string;
        };
        Update: {
          arcana?: string;
          image_url?: string;
          name?: string;
        };
        Relationships: [];
      };
      comment: {
        Row: {
          community_id: string;
          contents: string | null;
          created_at: string | null;
          id: string;
          is_deleted: boolean;
          parent_id: string | null;
          profile_id: string;
        };
        Insert: {
          community_id: string;
          contents?: string | null;
          created_at?: string | null;
          id?: string;
          is_deleted?: boolean;
          parent_id?: string | null;
          profile_id: string;
        };
        Update: {
          community_id?: string;
          contents?: string | null;
          created_at?: string | null;
          id?: string;
          is_deleted?: boolean;
          parent_id?: string | null;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'comment_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'community';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comment_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'comment';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'comment_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      community: {
        Row: {
          contents: string | null;
          created_at: string | null;
          file_urls: string[] | null;
          id: string;
          likes: number | null;
          profile_id: string;
          tarot_id: string | null;
          title: string | null;
        };
        Insert: {
          contents?: string | null;
          created_at?: string | null;
          file_urls?: string[] | null;
          id?: string;
          likes?: number | null;
          profile_id: string;
          tarot_id?: string | null;
          title?: string | null;
        };
        Update: {
          contents?: string | null;
          created_at?: string | null;
          file_urls?: string[] | null;
          id?: string;
          likes?: number | null;
          profile_id?: string;
          tarot_id?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'community_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'community_tarot_id_fkey';
            columns: ['tarot_id'];
            isOneToOne: false;
            referencedRelation: 'tarot';
            referencedColumns: ['id'];
          },
        ];
      };
      likes: {
        Row: {
          community_id: string;
          created_at: string | null;
          id: string;
          profile_id: string;
        };
        Insert: {
          community_id: string;
          created_at?: string | null;
          id?: string;
          profile_id: string;
        };
        Update: {
          community_id?: string;
          created_at?: string | null;
          id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'likes_community_id_fkey';
            columns: ['community_id'];
            isOneToOne: false;
            referencedRelation: 'community';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'likes_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      notification: {
        Row: {
          contents: string | null;
          created_at: string | null;
          id: string;
          profile_id: string;
          target_id: string | null;
          type: string | null;
        };
        Insert: {
          contents?: string | null;
          created_at?: string | null;
          id?: string;
          profile_id: string;
          target_id?: string | null;
          type?: string | null;
        };
        Update: {
          contents?: string | null;
          created_at?: string | null;
          id?: string;
          profile_id?: string;
          target_id?: string | null;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notification_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      profile: {
        Row: {
          created_at: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      record: {
        Row: {
          contents: string | null;
          created_at: string | null;
          id: string;
          profile_id: string;
          tarot_id: string;
          title: string | null;
        };
        Insert: {
          contents?: string | null;
          created_at?: string | null;
          id?: string;
          profile_id: string;
          tarot_id: string;
          title?: string | null;
        };
        Update: {
          contents?: string | null;
          created_at?: string | null;
          id?: string;
          profile_id?: string;
          tarot_id?: string;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'record_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'record_tarot_id_fkey';
            columns: ['tarot_id'];
            isOneToOne: false;
            referencedRelation: 'tarot';
            referencedColumns: ['id'];
          },
        ];
      };
      tarot: {
        Row: {
          created_at: string | null;
          id: string;
          profile_id: string;
          result: string | null;
          topic: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          profile_id: string;
          result?: string | null;
          topic?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          profile_id?: string;
          result?: string | null;
          topic?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tarot_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
        ];
      };
      tarot_info: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          parent_id: string | null;
          profile_id: string;
          result: string | null;
          tarot_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          parent_id?: string | null;
          profile_id: string;
          result?: string | null;
          tarot_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          profile_id?: string;
          result?: string | null;
          tarot_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tarot_info_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'tarot_info';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tarot_info_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tarot_info_tarot_id_fkey';
            columns: ['tarot_id'];
            isOneToOne: false;
            referencedRelation: 'tarot';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

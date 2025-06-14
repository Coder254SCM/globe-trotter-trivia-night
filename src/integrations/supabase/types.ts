export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      community_questions: {
        Row: {
          category: string
          correct_answer: string
          country_id: string
          created_at: string | null
          difficulty: string
          explanation: string | null
          id: string
          moderated_at: string | null
          moderated_by: string | null
          moderation_notes: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          status: string | null
          submitted_by: string | null
          text: string
          updated_at: string | null
          votes_down: number | null
          votes_up: number | null
        }
        Insert: {
          category: string
          correct_answer: string
          country_id: string
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          status?: string | null
          submitted_by?: string | null
          text: string
          updated_at?: string | null
          votes_down?: number | null
          votes_up?: number | null
        }
        Update: {
          category?: string
          correct_answer?: string
          country_id?: string
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_notes?: string | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          status?: string | null
          submitted_by?: string | null
          text?: string
          updated_at?: string | null
          votes_down?: number | null
          votes_up?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_questions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          area_km2: number | null
          capital: string | null
          categories: string[] | null
          continent: string
          created_at: string | null
          difficulty: string | null
          flag_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          population: number | null
          updated_at: string | null
        }
        Insert: {
          area_km2?: number | null
          capital?: string | null
          categories?: string[] | null
          continent: string
          created_at?: string | null
          difficulty?: string | null
          flag_url?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          name: string
          population?: number | null
          updated_at?: string | null
        }
        Update: {
          area_km2?: number | null
          capital?: string | null
          categories?: string[] | null
          continent?: string
          created_at?: string | null
          difficulty?: string | null
          flag_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          population?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      failed_questions: {
        Row: {
          failed_at: string | null
          id: string
          mastered: boolean | null
          question_id: string | null
          retry_count: number | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          failed_at?: string | null
          id?: string
          mastered?: boolean | null
          question_id?: string | null
          retry_count?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          failed_at?: string | null
          id?: string
          mastered?: boolean | null
          question_id?: string | null
          retry_count?: number | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "failed_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "failed_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "failed_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          member_count: number | null
          name: string
          rank: number | null
          total_score: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name: string
          rank?: number | null
          total_score?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          name?: string
          rank?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_groups_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          category: string | null
          country_id: string | null
          created_at: string | null
          group_id: string | null
          id: string
          period: string
          rank: number | null
          score: number
          user_id: string | null
        }
        Insert: {
          category?: string | null
          country_id?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          period: string
          rank?: number | null
          score: number
          user_id?: string | null
        }
        Update: {
          category?: string | null
          country_id?: string | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          period?: string
          rank?: number | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboards_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboards_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      question_rotations: {
        Row: {
          country_id: string
          created_at: string | null
          id: string
          questions_generated: number | null
          rotation_completed: boolean | null
          rotation_month: string
        }
        Insert: {
          country_id: string
          created_at?: string | null
          id?: string
          questions_generated?: number | null
          rotation_completed?: boolean | null
          rotation_month: string
        }
        Update: {
          country_id?: string
          created_at?: string | null
          id?: string
          questions_generated?: number | null
          rotation_completed?: boolean | null
          rotation_month?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_rotations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      question_votes: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          user_id: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_votes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          ai_generated: boolean | null
          category: string
          correct_answer: string
          country_id: string | null
          created_at: string | null
          difficulty: string
          explanation: string | null
          id: string
          image_url: string | null
          month_rotation: number | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          text: string
          updated_at: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          category: string
          correct_answer: string
          country_id?: string | null
          created_at?: string | null
          difficulty: string
          explanation?: string | null
          id: string
          image_url?: string | null
          month_rotation?: number | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          text: string
          updated_at?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          category?: string
          correct_answer?: string
          country_id?: string | null
          created_at?: string | null
          difficulty?: string
          explanation?: string | null
          id?: string
          image_url?: string | null
          month_rotation?: number | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number
          country_id: string | null
          difficulty: string | null
          id: string
          score: number
          session_type: string | null
          started_at: string | null
          time_taken: number | null
          total_questions: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers: number
          country_id?: string | null
          difficulty?: string | null
          id?: string
          score: number
          session_type?: string | null
          started_at?: string | null
          time_taken?: number | null
          total_questions: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number
          country_id?: string | null
          difficulty?: string | null
          id?: string
          score?: number
          session_type?: string | null
          started_at?: string | null
          time_taken?: number | null
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_attempts: {
        Row: {
          challenge_id: string
          completed_at: string | null
          id: string
          questions_correct: number | null
          score: number
          total_questions: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          id?: string
          questions_correct?: number | null
          score?: number
          total_questions?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          id?: string
          questions_correct?: number | null
          score?: number
          total_questions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          correct_answers: number | null
          countries_mastered: number | null
          created_at: string | null
          group_id: string | null
          id: string
          individual_rank: number | null
          questions_answered: number | null
          total_score: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          correct_answers?: number | null
          countries_mastered?: number | null
          created_at?: string | null
          group_id?: string | null
          id: string
          individual_rank?: number | null
          questions_answered?: number | null
          total_score?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          correct_answers?: number | null
          countries_mastered?: number | null
          created_at?: string | null
          group_id?: string | null
          id?: string
          individual_rank?: number | null
          questions_answered?: number | null
          total_score?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_challenges: {
        Row: {
          created_at: string | null
          id: string
          participants: number | null
          question_ids: string[]
          week_end: string
          week_start: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          participants?: number | null
          question_ids: string[]
          week_end: string
          week_start: string
        }
        Update: {
          created_at?: string | null
          id?: string
          participants?: number | null
          question_ids?: string[]
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

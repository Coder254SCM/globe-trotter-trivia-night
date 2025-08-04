export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_color: string | null
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          badge_color?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          badge_color?: string | null
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
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
      friendships: {
        Row: {
          accepted_at: string | null
          addressee_id: string
          created_at: string | null
          id: string
          requester_id: string
          status: string | null
        }
        Insert: {
          accepted_at?: string | null
          addressee_id: string
          created_at?: string | null
          id?: string
          requester_id: string
          status?: string | null
        }
        Update: {
          accepted_at?: string | null
          addressee_id?: string
          created_at?: string | null
          id?: string
          requester_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_addressee_id_fkey"
            columns: ["addressee_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_requester_id_fkey"
            columns: ["requester_id"]
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
      leaderboard_snapshots: {
        Row: {
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          period_type: string
          rankings: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          period_type: string
          rankings: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          period_type?: string
          rankings?: Json
        }
        Relationships: []
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
      moderation_actions: {
        Row: {
          action: string
          created_at: string
          id: string
          moderator_id: string
          question_id: string
          reason: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          moderator_id: string
          question_id: string
          reason: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          moderator_id?: string
          question_id?: string
          reason?: string
        }
        Relationships: []
      }
      multiplayer_participants: {
        Row: {
          current_position: number | null
          current_score: number | null
          id: string
          is_ready: boolean | null
          joined_at: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          current_position?: number | null
          current_score?: number | null
          id?: string
          is_ready?: boolean | null
          joined_at?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          current_position?: number | null
          current_score?: number | null
          id?: string
          is_ready?: boolean | null
          joined_at?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiplayer_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "multiplayer_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "multiplayer_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      multiplayer_sessions: {
        Row: {
          created_at: string | null
          current_players: number | null
          ended_at: string | null
          host_id: string
          id: string
          max_players: number | null
          questions_per_round: number | null
          room_code: string
          started_at: string | null
          status: string | null
          time_per_question: number | null
        }
        Insert: {
          created_at?: string | null
          current_players?: number | null
          ended_at?: string | null
          host_id: string
          id?: string
          max_players?: number | null
          questions_per_round?: number | null
          room_code: string
          started_at?: string | null
          status?: string | null
          time_per_question?: number | null
        }
        Update: {
          created_at?: string | null
          current_players?: number | null
          ended_at?: string | null
          host_id?: string
          id?: string
          max_players?: number | null
          questions_per_round?: number | null
          room_code?: string
          started_at?: string | null
          status?: string | null
          time_per_question?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "multiplayer_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_reports: {
        Row: {
          created_at: string
          description: string
          id: string
          issue_type: string
          moderated_at: string | null
          moderated_by: string | null
          question_id: string
          reported_by: string
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          issue_type: string
          moderated_at?: string | null
          moderated_by?: string | null
          question_id: string
          reported_by: string
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          issue_type?: string
          moderated_at?: string | null
          moderated_by?: string | null
          question_id?: string
          reported_by?: string
          status?: string
        }
        Relationships: []
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
      question_stats: {
        Row: {
          average_time_seconds: number | null
          difficulty_rating: number | null
          id: string
          last_updated: string | null
          question_id: string
          times_asked: number | null
          times_correct: number | null
        }
        Insert: {
          average_time_seconds?: number | null
          difficulty_rating?: number | null
          id?: string
          last_updated?: string | null
          question_id: string
          times_asked?: number | null
          times_correct?: number | null
        }
        Update: {
          average_time_seconds?: number | null
          difficulty_rating?: number | null
          id?: string
          last_updated?: string | null
          question_id?: string
          times_asked?: number | null
          times_correct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_stats_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
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
          challenge_id: string | null
          completed_at: string | null
          correct_answers: number
          country_id: string | null
          difficulty: string | null
          id: string
          quiz_type: string | null
          score: number
          session_type: string | null
          started_at: string | null
          started_by: string | null
          time_taken: number | null
          total_questions: number
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed_at?: string | null
          correct_answers: number
          country_id?: string | null
          difficulty?: string | null
          id?: string
          quiz_type?: string | null
          score: number
          session_type?: string | null
          started_at?: string | null
          started_by?: string | null
          time_taken?: number | null
          total_questions: number
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed_at?: string | null
          correct_answers?: number
          country_id?: string | null
          difficulty?: string | null
          id?: string
          quiz_type?: string | null
          score?: number
          session_type?: string | null
          started_at?: string | null
          started_by?: string | null
          time_taken?: number | null
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_started_by_fkey"
            columns: ["started_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
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
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
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
      user_stats: {
        Row: {
          average_score: number | null
          current_streak: number | null
          favorite_category: string | null
          id: string
          last_quiz_date: string | null
          longest_streak: number | null
          total_time_played: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_score?: number | null
          current_streak?: number | null
          favorite_category?: string | null
          id?: string
          last_quiz_date?: string | null
          longest_streak?: number | null
          total_time_played?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_score?: number | null
          current_streak?: number | null
          favorite_category?: string | null
          id?: string
          last_quiz_date?: string | null
          longest_streak?: number | null
          total_time_played?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      bootstrap_admin_user: {
        Args: { user_email: string }
        Returns: boolean
      }
      decrement_session_players: {
        Args: { session_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_session_players: {
        Args: { session_id: string }
        Returns: undefined
      }
      pre_validate_question: {
        Args: {
          p_text: string
          p_option_a: string
          p_option_b: string
          p_option_c: string
          p_option_d: string
          p_correct_answer: string
          p_difficulty?: string
          p_country_id?: string
        }
        Returns: Json
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
